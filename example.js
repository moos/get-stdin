// Example.js
const getStdin = require('.');

(async () => {
	console.log(await getStdin({tty: true/* ,EOF: getStdin.CTRL_D */}));
})();
