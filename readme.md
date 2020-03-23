# get-stdin-with-tty

[![NPM version](https://img.shields.io/npm/v/get-stdin-with-tty.svg)](https://www.npmjs.com/package/get-stdin-with-tty)
[![Build Status](https://travis-ci.org/moos/get-stdin-with-tty.svg?branch=master)](https://travis-ci.org/github/moos/get-stdin-with-tty)

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
	console.log(await getStdin());
})();
```

```
$ echo unicorns | node example.js
unicorns
```

## API

Both methods returns a promise that is resolved when the `end` event fires on the `stdin` stream, indicating that there is no more data to be read.

### getStdin(options) ← Promise&lt;String&gt;

Get `stdin` as a `string`.

In a TTY context, a promise that resolves to an empty string is returned, unless `options.tty` or `getStdin.tty` is true.

### getStdin.buffer()  ← Promise&lt;Buffer&gt;

Get `stdin` as a `Buffer`.

In a TTY context, a promise that resolves to an empty `Buffer` is returned.

### Options / Settings

- `tty` | `getStdin.tty` (Boolean) -
   Set global TTY handling.  When true, accepts input from TTY until a new line beginning with Ctrl-d or Ctrl-z is entered.  Double Ctrl-d [anywhere in the line](https://stackoverflow.com/a/21261742/302177) also ends the stream. (Default = `true`)

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

- `EOF` | `getStdin.EOF` (String) - The end-of-file (aka [EOT](https://en.wikipedia.org/wiki/End-of-Transmission_character)) character to use to signal end of stream.  Defaults to **Ctrl-d** on \*nix and cygwin, and **Ctrl-z** on Windows.  Acceptable values:
    - `getStdin.CTRL_D` - Ctrl-d (ASCII 04)
    - `getStdin.CTRL_Z` - Ctrl-z (ASCII 26)
    - `'*'` - Use both Ctrl-d and Ctrl-z

	```shell
	(win) c:\> node example.js
	foobar
	^z
	# => foobar
	```
	```bash
	$ node example.js
	foobar^d^d
	# => foobar
	```

## Moos Fork

The [moos fork](https://github.com/moos/get-stdin) includes support for reading stdin from TTY by default.

## Related

- [get-stream](https://github.com/sindresorhus/get-stream) - Get a stream as a string or buffer

## Change log

- 6.0.0 - `tty` option is now defaulted to `true`. Double Ctrl-d in middle of line also ends stream.
- 5.0.2 - Initial fork.

## License

MIT © [Sindre Sorhus](http://sindresorhus.com)
© [Moos](http://github.com/moos)
