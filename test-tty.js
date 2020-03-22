import {serial as test, beforeEach} from 'ava';
import getStdin from '.';
process.stdin.isTTY = true;

beforeEach(() => {
	process.stdin.removeAllListeners();
});

test('get stdin in TTY mode with ^d', async t => {
	const promise = getStdin({tty: true});

	process.stdin.push('uni');
	process.stdin.push('corn');
	process.stdin.push('\u0004');

	t.is(await promise, 'unicorn');
});

test('get stdin in TTY mode with ^z', async t => {
	const promise = getStdin({tty: true});

	process.stdin.push('uni');
	process.stdin.push('corn\n');
	process.stdin.push('\u001A\n');

	t.is(await promise, 'unicorn\n');
});

test('get stdin in TTY mode using global tty', async t => {
	getStdin.tty = true;
	const promise = getStdin();

	process.stdin.push('uni');
	process.stdin.push('corn');
	process.stdin.push('\u0004');

	t.is(await promise, 'unicorn');
});

test('get empty string in non-TTY mode with option override', async t => {
	getStdin.tty = true;
	const promise = getStdin({tty: false});

	process.stdin.push('uni');
	process.stdin.push('corn');
	process.stdin.push('\u0004');
	process.stdin.emit('end');

	getStdin.tty = true;
	t.is(await promise, '');
});
