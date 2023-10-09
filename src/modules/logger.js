const pino = require("pino");

//* https://github.com/pinojs/pino-pretty
const logger = pino({
	transport: {
		target: "pino-pretty",
		options: {
			colorize: false,
			ignore: "pid,hostname",
		},
	},
});

/**
 * @type {pino.BaseLogger}
 */
module.exports = logger;
