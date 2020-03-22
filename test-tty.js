import getStdin from '.';
import {serial as test, beforeEach} from 'ava';

process.stdin.isTTY = true;

beforeEach(() => {
	process.stdin.removeAllListeners();
});

test('get stdin in TTY mode with ^d', async t => {
	const promise = getStdin({tty: true, EOF: getStdin.CTRL_D});
	process.stdin.push('uni');
	process.stdin.push('corn');
	process.stdin.push(getStdin.CTRL_D);
	t.is(await promise, 'unicorn');
});

test('get stdin in TTY mode with TWO ^d in middle', async t => {
	const promise = getStdin({tty: true, EOF: getStdin.CTRL_D});
	process.stdin.push('uni');
	process.stdin.push('corn');
	process.stdin.push('foo' + getStdin.CTRL_D + getStdin.CTRL_D);
	t.is(await promise, 'unicornfoo');
});

test('get stdin in TTY mode with ^z', async t => {
	const promise = getStdin({tty: true, EOF: getStdin.CTRL_Z});
	process.stdin.push('uni');
	process.stdin.push('corn\n');
	process.stdin.push(getStdin.CTRL_Z);
	t.is(await promise, 'unicorn\n');
});

test('get stdin in TTY mode with TWO ^z in middle', async t => {
	const promise = getStdin({tty: true, EOF: getStdin.CTRL_Z});
	process.stdin.push('uni');
	process.stdin.push('corn\n');
	process.stdin.push('foo' + getStdin.CTRL_Z + getStdin.CTRL_Z); // Does not end stream!
	process.stdin.push(getStdin.CTRL_Z);
	t.is(await promise, 'unicorn\nfoo' + getStdin.CTRL_Z + getStdin.CTRL_Z);
});

test('get stdin in TTY mode with "*" and ^d', async t => {
	const promise = getStdin({tty: true, EOF: '*'});
	process.stdin.push('uni');
	process.stdin.push('corn');
	process.stdin.push(getStdin.CTRL_D);
	t.is(await promise, 'unicorn');
});

test('get stdin in TTY mode with "*" and ^z', async t => {
	const promise = getStdin({tty: true, EOF: '*'});
	process.stdin.push('uni');
	process.stdin.push('corn\n');
	process.stdin.push(getStdin.CTRL_Z);
	t.is(await promise, 'unicorn\n');
});

test('get stdin in TTY mode using global tty', async t => {
	getStdin.tty = true;
	getStdin.EOF = getStdin.CTRL_D;
	const promise = getStdin();

	process.stdin.push('uni');
	process.stdin.push('corn');
	process.stdin.push(getStdin.CTRL_D);

	t.is(await promise, 'unicorn');
});

test('get empty string in non-TTY mode with option override', async t => {
	getStdin.tty = true;
	const promise = getStdin({tty: false});

	process.stdin.push('uni');
	process.stdin.push('corn');
	process.stdin.push(getStdin.CTRL_Z);
	process.stdin.emit('end');

	getStdin.tty = true;
	t.is(await promise, '');
});
