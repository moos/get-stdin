import {expectType} from 'tsd';
import getStdin = require('.');

expectType<Promise<string>>(getStdin());
expectType<Promise<string>>(getStdin({tty: true}));
expectType<Promise<Buffer>>(getStdin.buffer());
