require("dotenv").config();
const bot = require("./handlers/socket");
const server = require("./server");
const db = new (require("quick.db").QuickDB)({ filePath: "db.sqlite" });

bot.on("rainRunning", (rain) => {
	rain.amount /= 1000; // ccc3: I'm storing numbers in thousands as I experienced difficulties with decimals

	server.io.emit("rainRunning", {
		_id: rain._id,
		type: rain.type,
		amount: rain.amount,
		creator: rain.creator ?? null,
	});
});

bot.on("rainCompleted", (rain) => {
	rain.amount /= 1000;
	
	db.push("rains", rain);
});
