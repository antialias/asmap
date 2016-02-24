# smapper
Applies a sourcemap to a line and offset to tell you where the original code is.

##installation:
```sh
npm install -g smap
```

##usage:
```bash
> smap --url https://adminv2.1stdibs.com/compiled/js/dealers/message-center.js --line 2 --column 19402 

{ source: 'webpack:///~/bunsen/components/messageCenter/MessageSummary/MessageSummary-view.js?3b3e',
  line: 130,
  column: 0,
  name: 'bubbleMatch' }
```
