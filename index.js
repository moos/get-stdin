'use strict';
const {stdin} = process;

module.exports = options => {
	let result = '';
	let tty = (options && 'tty' in options) ? options.tty : module.exports.tty;

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
					const chunkStart = beforeEOF(chunk);
					if (chunkStart) {
						result += chunkStart;
						return stdin.emit('end');
					}
				}

				result += chunk;
			}
		});

		stdin.on('end', () => {
			resolve(result);
		});
	});
};

module.exports.buffer = () => {
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

// Disable tty for backward compatibility
module.exports.tty = false;

// In TTY mode, handle ^z or ^d appended after the input
function beforeEOF(chunk) {
	let EOF = chunk.indexOf('\u0004');
	if (EOF < 0) {
		EOF = chunk.indexOf('\u001A');
		if (EOF < 0) {
			return;
		}
	}

	return chunk.slice(0, EOF);
}
