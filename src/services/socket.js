const WebSocket = require("websocket").w3cwebsocket;
const { EventEmitter } = require("node:events");
const events = new EventEmitter();
const constants = require("../constants.js");
const { unmarshall } = require("../utils/packet.js");

/**
 * @type {WebSocket}
 */
let connection;

async function connect() {
	connection = new WebSocket(constants.websocket.url, undefined, undefined, constants.websocket.headers);
	connection.onopen = () => {
		events.emit("connect");
	};
	connection.onerror = (error) => {
		events.emit("error", error);
	};
	connection.onclose = (event) => {
		events.emit("disconnect", event);
	};
	connection.onmessage = async function ({ data: packet }) {
		packet = unmarshall(packet);
		events.emit("packet", packet);
	};
}

module.exports = {
	events,
	connect,
	getConnection: () => connection,
};
