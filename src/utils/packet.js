const { isJsonStructured } = require("./json.js");

const packetUtils = {
	packetType: (str) => ((str) => (typeof str === "string" ? Number(str) : undefined))(str.match?.(/^\d+/gi)?.[0]),
	namespace: (str) => str.match?.(/(?<=^\d+\/)[a-z]+(?=,)/gi)?.[0],
	ackId: (str) => ((str) => (typeof str === "string" ? Number(str) : undefined))(str.match?.(/(?<=^\d+\/[a-z]+,)\d+/gi)?.[0]),
	payload: (str) => str.match?.(/\d+\/[a-z]+,\d*(.+)/i)?.[1],
};
module.exports = packetUtils;

/**
 * Marshall packet
 * https://en.wikipedia.org/wiki/Marshalling_(computer_science)
 * https://socket.io/docs/v4/socket-io-protocol/#packet-encoding
 *
 * @param {number} packetType
 * @param {string} namespace
 * @param {number} ackId *
 * @param {Object} payload
 * @returns {string} Encoded packet
 */
module.exports.marshall = (packetType, namespace, ackId, payload) => {
	return `${packetType}${namespace ? "/" + namespace + "," : ""}${ackId ?? ""}${namespace ? JSON.stringify(payload) : ""}`;
};

/**
 * Unmarshall packet
 * https://socket.io/docs/v4/socket-io-protocol/#packet-encoding
 * https://en.wikipedia.org/wiki/Marshalling_(computer_science)
 *
 * @param {string} packetString
 * @returns {{ packetType: number, namespace: string, ackId: number, payload: object }}
 */
module.exports.unmarshall = (packetString) => {
	const packetType = packetUtils.packetType(packetString);
	const namespace = packetUtils.namespace(packetString);
	const ackId = packetUtils.ackId(packetString);
	const payload = ((payload) => (isJsonStructured(payload) ? JSON.parse(payload) : payload))(packetUtils.payload(packetString));

	return { packetType, namespace, ackId, payload };
};
