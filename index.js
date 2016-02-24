#!/usr/bin/env node
var SourceMapConsumer = require('source-map').SourceMapConsumer;
var argv = require('yargs').argv;
var fs = require('fs');
var promisify = require('es6-promisify');
var request = promisify(require('request'), function (err, result) {
    return this.resolve(result[1]);
}); // resolve with response body
var requestCB = (url, callback) => request(url).then(body => callback(null, body));
var resolveSourceMap = promisify(require('source-map-resolve').resolveSourceMap);

new Promise((resolve, reject) => {
    if (global.v8debug || process.stdin.isTTY) {
        request(argv.url).then(resolve);
        return;
    }
    var codeLines = [];
    process.stdin.setEncoding('utf8');
    process.stdin.on('readable', () => {
        var chunk = process.stdin.read();
        if (chunk !== null) {
            codeLines.push(chunk);
        }
    });
    process.stdin.on('end', () => resolve(codeLines.join('')));
})
    .then(code => resolveSourceMap(code, argv.url, requestCB))
    .then(sourcemapInfo => {
        if (!sourcemapInfo) {
            console.log('no sourcemap');
            return;
        }
        var consumer = new SourceMapConsumer(sourcemapInfo.map);
        console.log(consumer.originalPositionFor({
            line: argv.line,
            column: argv.column
        }));
    })
    .catch(e => setTimeout(() => {throw e}));
