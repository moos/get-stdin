# get-stdin-with-tty

[![NPM version](https://img.shields.io/npm/v/get-stdin.svg)](https://www.npmjs.com/package/get-stdin-with-tty)
[![Build Status](https://travis-ci.org/moos/get-stdin.svg?branch=master)](https://travis-ci.org/moos/get-stdin)

> Get [stdin](https://nodejs.org/api/process.html#process_process_stdin) as a string or buffer

## Install

```
$ npm install get-stdin-with-tty
```

## Usage

```js
// example.js
const getStdin = require('get-stdin-with-tty');

(async () => {
	console.log(await getStdin({ tty: true }));
	//=> 'unicorns'
})();
```

```
$ echo unicorns | node example.js
unicorns
```

## API

Both methods returns a promise that is resolved when the `end` event fires on the `stdin` stream, indicating that there is no more data to be read.

### getStdin([options])

Get `stdin` as a `string`.

In a TTY context, a promise that resolves to an empty string is returned, unless `options.tty` or `getStdin.tty` is true.

### getStdin.buffer()

Get `stdin` as a `Buffer`.

In a TTY context, a promise that resolves to an empty `Buffer` is returned.

### getStdin.tty = true/false

Set global TTY handling.  When true, accepts input from TTY until a new line beginning with Ctrl-d or Ctrl-z (ASCII 04 and 26) is entered. (default = `true`)

When enabled for the example above:

``` 
$ node example.js
foobar
barfoo
^d
// =>
foobar
barfoo
```

## Moos Fork

The [moos fork](https://github.com/moos/get-stdin) includes support for reading stdin from TTY by default.

## Related

- [get-stream](https://github.com/sindresorhus/get-stream) - Get a stream as a string or buffer

## License

MIT © [Sindre Sorhus](http://sindresorhus.com)
© [Moos](http://github.com/moos)
