const { events: socket, connect, getConnection } = require("../services/socket.js");
const { marshall } = require("../utils/packet.js");
const { EventEmitter } = require("node:events");
const events = new EventEmitter();

connect();
socket.on("connect", () => {
	events.emit("connect");
});
socket.on("disconnect", () => {
	events.emit("disconnect");
	setTimeout(() => {
		connect();
	}, 1_000);
});
socket.on("error", () => {
	getConnection().close();
	setTimeout(() => {
		connect();
	}, 1_000);
});
socket.on(
	"packet",
	/**
	 * @param {{ packetType: number, namespace: string, ackId: number, payload: object }} packet
	 */
	async (packet) => {
		const connection = getConnection();
		switch (packet.packetType) {
			case 0: {
				connection.send(marshall(40, "general", undefined, {}));
				connection.send(marshall(40, "cashier", undefined, {}));
				break;
			}
			case 2: {
				// Ping
				connection.send(marshall(3)); // Pong
				break;
			}
			case 42: {
				/**
				 * The subspace of the payload (e.g.: "rain", "chatMessage")
				 * The subspace comes after the namespace (e.g.: "general")
				 *
				 * @type {string}
				 */
				const subspace = packet.payload[0];
				/**
				 * The data that comes after the subspace
				 *
				 * @type {Object}
				 */
				const data = packet.payload[1];

				switch (packet.namespace) {
					case "general":
						switch (subspace) {
							case "init": {
								connection.send(marshall(42, "general", 0, ["getChatMessages", { room: "en" }]));
								break;
							}
							case "chatMessage": {
								const { message } = data;
								switch (message.type) {
									case "rainCompleted":
										events.emit("rainCompleted", message.rain);
										break;
								}
								break;
							}
							case "rain": {
								const rain = data.rain;
								rain.participants = rain.participants?.length ?? 0;
								events.emit("rain" + rain.state.charAt(0).toUpperCase() + rain.state.substring(1), rain);
								break;
							}
							default: {
								events.emit(subspace, data);
							}
						}
						break;
				}
				break;
			}
		}
	},
);

module.exports = events;
