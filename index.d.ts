/// <reference types="node"/>

interface Options {
	/**
	Enables reading from TTY, which can be anded by ^d or ^z.
	*/
	tty?: boolean;
}

declare const getStdin: {
	/**
	Get [`stdin`](https://nodejs.org/api/process.html#process_process_stdin) as a `string`.

	@param options If set to `{ tty: true }`, input TTY will be handled correctly. Otherwise only input from a pipe will work.

	@returns A promise that is resolved when the `end` event fires on the `stdin` stream, indicating that there is no more data to be read. In a TTY context, an empty `string` is returned.

	@example
	```
	// example.ts
	import getStdin = require('get-stdin-with-tty');

	(async () => {
		console.log(await getStdin({ tty: true }));
		//=> 'unicorns'
	})

	// $ echo unicorns | ts-node example.ts
	// unicorns
	```
	*/
	(options?: Options): Promise<string>;

	/**
	Get [`stdin`](https://nodejs.org/api/process.html#process_process_stdin) as a `Buffer`.

	@returns A promise that is resolved when the `end` event fires on the `stdin` stream, indicating that there is no more data to be read. In a TTY context, an empty `Buffer` is returned.
	*/
	buffer(): Promise<Buffer>;
};

export = getStdin;
