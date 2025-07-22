const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const RouteData = require("../models/RouteData");

// MongoDB接続
async function connectDB() {
	try {
		const mongoURI = process.env.MONGODB_URI || "mongodb://mongo:27017/kgu-ev-guide";
		mongoose.set("strictQuery", false);

		await mongoose.connect(mongoURI);
		console.log("[KGU EV Guide] MongoDB connected successfully");
	} catch (error) {
		console.error("[KGU EV Guide] MongoDB connection error:", error);
		process.exit(1);
	}
}

// JSONファイルからMongoDBにデータを初期化
async function initializeRouteDataFromJSON() {
	try {
		const jsonData = JSON.parse(
			fs.readFileSync(`${__dirname}/../db/routeData.json`, "utf-8")
		);

		// 既存のデータをクリア
		await RouteData.deleteMany({});

		// JSONデータをMongoDBに変換
		for (const building in jsonData) {
			for (const floor in jsonData[building]) {
				for (const room in jsonData[building][floor]) {
					const routes = jsonData[building][floor][room];

					// 空のオブジェクトの場合はスキップ
					if (Object.keys(routes).length === 0) {
						continue;
					}

					const routeData = new RouteData({
						building,
						floor,
						room,
						routes: new Map(Object.entries(routes)),
					});

					await routeData.save();
				}
			}
		}

		console.log("[KGU EV Guide] Route data initialized from JSON file");
	} catch (error) {
		console.error("[KGU EV Guide] Error initializing route data:", error);
	}
}

// MongoDBからJSONファイルにデータを書き出し
async function syncMongoDBToJSON() {
	try {
		const allRouteData = await RouteData.find({});
		const jsonStructure = {
			A: {},
			B: {},
		};

		// 各建物とフロアの構造を初期化
		for (const building of ["A", "B"]) {
			for (let i = 1; i <= 28; i++) {
				jsonStructure[building][i.toString()] = {};
			}
			for (const basement of ["B6", "B5", "B4", "B3", "B2", "B1"]) {
				jsonStructure[building][basement] = {};
			}
		}

		// MongoDBのデータを構造に追加
		allRouteData.forEach((routeData) => {
			const { building, floor, room, routes } = routeData;
			if (
				jsonStructure[building] &&
				jsonStructure[building][floor] !== undefined
			) {
				jsonStructure[building][floor][room] = Object.fromEntries(routes);
			}
		});

		// JSONファイルに書き込み
		fs.writeFileSync(
			`${__dirname}/../db/routeData.json`, // ファイルパス
			JSON.stringify(jsonStructure, null, 2) // 書き込むデータ（JSON文字列）
		);

		console.log("[KGU EV Guide] Route data synced to JSON file");
	} catch (error) {
		console.error("[KGU EV Guide] Error syncing data to JSON:", error);
	}
}

// 30分ごとにデータを同期する
function startPeriodicSync() {
	setInterval(async () => {
		await syncMongoDBToJSON();
	}, 30 * 60 * 1000); // 30分 = 30 * 60 * 1000 ミリ秒

	console.log("[KGU EV Guide] Periodic sync started (every 30 minutes)");
}

module.exports = {
	connectDB,
	initializeRouteDataFromJSON,
	syncMongoDBToJSON,
	startPeriodicSync,
};
