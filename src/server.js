const { createServer } = require("node:http");
const express = require("express");
const { Server } = require("socket.io");

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
	path: "/",
	cors: {
		origin: "*",
	},
});

module.exports.io = io;
module.exports.app = app;

io.on("connection", (socket) => {
	socket.once("disconnect", () => {});
});

httpServer.listen(process.env.PORT);
