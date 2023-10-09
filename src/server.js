require("dotenv").config();

const { createServer } = require("node:http");
const express = require("express");
const { Server } = require("socket.io");
const bot = require("./handlers/socket.js");
const logger = require("./modules/logger.js");
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
	path: "/",
	cors: {
		origin: "*", // Allow connections from all origins
	},
});

let runningRain = null;

bot.on("connect", () => {
	logger.info("Connected to RBLXRoll");
});

bot.on("disconnect", () => {
	logger.info("Disconnected from RBLXRoll");
});

bot.on("rainRunning", (rain) => {
	if (runningRain?._id === rain._id) return; // Don't emit again
	logger.info("Rain running");

	runningRain = {
		_id: rain._id,
		type: rain.type,
		amount: rain.amount / 1_000, // ccc33: I'm storing numbers in thousands as I experienced difficulties with decimals
		creator: rain.creator ?? null,
	};

	io.emit("rainRunning", runningRain);
});

bot.on("rainCompleted", () => {
	runningRain = null; // Nullify it so it doesn't get reemitted on connection
	logger.info("Rain ended");
});

io.on("connection", (socket) => {
	if (runningRain) {
		socket.emit("rainRunning", runningRain);
	}
});

const port = process.env.PORT || 8080;
httpServer.listen(port, undefined, () => {
	logger.info(`Listening on port ${port}`);
});
