# web-wallet
kvartalo (v1) web wallet app

Wallet for [kvartalochain](https://github.com/kvartalo/kvartalochain)


### lib generation
This is already done.

- instascan
```
browserify index.js --standalone instascan > instascan-browserified.js
```

- qrcode
```
browserify index.js --standalone qrcode > qrcode-browserified.js
```

- kvartalochain WASM clientlib
	- see https://github.com/kvartalo/kvartalochain/tree/master/wasm
