'use strict';
const {
	stdin,
	platform,
	env
} = process;
const CTRL_D = '\u0004';
const CTRL_Z = '\u001A';

const getStdin = (options = {}) => {
	let result = '';
	let tty = ('tty' in options) ? options.tty : getStdin.tty;
	const EOF = options.EOF || getStdin.EOF;

	// In TTY mode, handle ^z or ^d appended after the input
	const beforeEOF = (chunk, eof) => {
		let end = chunk.indexOf(eof);

		// Single EOF at beginning of line
		if (end === 0) {
			return true;
		}

		// EOF anywhere and win32 -- eats the input.
		if (eof === CTRL_Z) {
			return env > 0;
		}

		// Double EOF in middle of line (*nix)
		end = chunk.indexOf(eof + eof);
		if (end < 0) {
			return false;
		}

		return chunk.slice(0, end);
	};

	return new Promise(resolve => {
		if (stdin.isTTY && !tty) {
			resolve(result);
			return;
		}

		tty = stdin.isTTY && tty;
		stdin.setEncoding('utf8');

		stdin.on('readable', () => {
			let chunk;

			while ((chunk = stdin.read())) {
				if (tty) {
					const chunkStart = EOF === '*' ?
						beforeEOF(chunk, CTRL_D) || beforeEOF(chunk, CTRL_Z) :
						beforeEOF(chunk, EOF);
					if (chunkStart) {
						if (chunkStart !== true) {
							result += chunkStart;
						}

						return stdin.emit('end');
					}
				}

				result += chunk;
			}
		});

		stdin.on('end', () => {
			resolve(result);// + ` ${result.length}`);
		});
	});
};

getStdin.buffer = () => {
	const result = [];
	let length = 0;

	return new Promise(resolve => {
		if (stdin.isTTY) {
			resolve(Buffer.concat([]));
			return;
		}

		stdin.on('readable', () => {
			let chunk;

			while ((chunk = stdin.read())) {
				result.push(chunk);
				length += chunk.length;
			}
		});

		stdin.on('end', () => {
			resolve(Buffer.concat(result, length));
		});
	});
};

getStdin.tty = true;
getStdin.EOF = platform === 'win32' && env.TERM !== 'cygwin' ? CTRL_Z : CTRL_D;

getStdin.CTRL_D = CTRL_D;
getStdin.CTRL_Z = CTRL_Z;

module.exports = getStdin;
