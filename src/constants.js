module.exports = {
	websocket: {
		url: "wss://api.rblxroll.com/socket.io/?EIO=4&transport=websocket",
		headers: {
			"user-agent": `rblxroll-rain-socket/${require("../package.json")?.version || "?"} (github.com/robertsspaceindustries/rblxroll-rain-socket)`,
		},
	},
};
