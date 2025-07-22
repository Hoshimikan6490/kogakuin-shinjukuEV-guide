const express = require("express");
const app = express();
const fs = require("fs");
const fetch = (...args) =>
	import("node-fetch").then(({ default: fetch }) => fetch(...args));
require("dotenv").config({ quiet: true });
// MongoDB関連のインポート
const mongoose = require("mongoose");
const {
	connectDB,
	initializeRouteDataFromJSON,
	startPeriodicSync,
	syncMongoDBToJSON,
} = require("./utils/database");
const RouteData = require("./models/RouteData");

// ポートの設定
let port = process.env.PORT || 80;

// View engineをejsに設定
app.set("view engine", "ejs");

// JSONの受け取りを許可
app.use(express.json());

// 必要なデータを準備
app.use(express.static("views"));
app.use("views", express.static("views"));

// 部屋番号が正しいか確認するfunction
function isAvailableRoomID(roomDB, roomID) {
	// 形式が正しいか確認
	if (roomID.match(/^[AB]-\d{4}$/)) {
		// 部屋番号の形式が正しい場合、部屋DBに存在するか確認
		let building = roomID.split("-")[0];
		let roomNumber = roomID.split("-")[1];

		let floor;
		if (roomNumber.startsWith("B")) {
			// 地下フロアの場合
			floor = `B${roomNumber.substring(1, 2)}`;
		} else {
			// 地上フロアの場合
			floor = String(Number(roomNumber.substring(0, 2)));
		}

		// 建物が存在するか確認
		if (roomDB[building]) {
			// フロアが存在するか確認
			if (roomDB[building][floor]) {
				// 部屋番号が存在するか確認
				return roomDB[building][floor].includes(roomID);
			}
		}

		// どれかが存在しない場合はfalseを返す
		return false;
	}
}

function checkRoomID(roomID, building, floor) {
	try {
		let roomDB = fs.readFileSync(`${__dirname}/db/roomData.json`, "utf-8");
		roomDB = JSON.parse(roomDB);

		// 部屋番号から他の情報を取得する
		if (roomID == "アトリウム") {
			return {
				correct: true,
				building: "A",
				floor: "1",
				room: "アトリウム",
			};
		} else if (roomID == "アーバンテックホール") {
			return {
				correct: true,
				building: "A",
				floor: "3",
				room: "アーバンテックホール",
			};
		}

		if (roomID) {
			// 正しい部屋番号形式であり、その部屋が存在するか確認
			if (isAvailableRoomID(roomDB, roomID)) {
				let roomNumber = roomID.split("-")[1];
				let floor;
				if (roomNumber.startsWith("B")) {
					// 地下フロアの場合
					floor = `B${roomNumber.substring(1, 2)}`;
				} else {
					// 地上フロアの場合
					floor = String(Number(roomNumber.substring(0, 2)));
				}

				return (roomInfo = {
					correct: true,
					building: roomID.split("-")[0],
					floor: floor,
					room: roomID,
				});
			} else {
				return { correct: false };
			}
		}

		// 建物やフロア番号から取得する
		if (!building && floor) {
			// 階の指定のみがあった場合
			roomDB.A = {
				[floor]: roomDB.A[floor],
			};
			roomDB.B = {
				[floor]: roomDB.B[floor],
			};
		} else if (building && !floor) {
			// 建物の指定のみがあった場合
			roomDB = { [building]: roomDB[building] };
			if (!roomDB) {
				roomDB = {};
			}
		} else if (building && floor) {
			// 階と建物の両方の指定があった場合
			roomDB = {
				[building]: {
					[floor]: roomDB[building][floor],
				},
			};
		}
		roomDB.correct = true;
		return roomDB;
	} catch (error) {
		console.error(error);
		return { correct: false };
	}
}

// 各種ルーティングとCGIの設定
app.get("/", (req, res) => {
	res.render(`pages/index`, { pageTitle: "ホーム" });
});

app.get("/api/roomData", async (req, res) => {
	let room = req.query.room;
	let building = req.query.building;
	let floor = req.query.floor;
	let roomData = await checkRoomID(room, building, floor);

	if (roomData.correct) {
		return res.send(roomData);
	} else {
		return res.status(400).send("Room data not found.");
	}
});

app.get("/search", async (req, res) => {
	let room = req.query.room;

	// 部屋番号の指定が無い場合はrootページにリダイレクト
	if (!room) {
		return res.redirect("/");
	}

	// 部屋番号から他データを取得
	let roomData = await checkRoomID(room);
	if (!roomData.correct) {
		return res.status(400).send("Invalid room number format.");
	}

	// MongoDBからルートデータを取得
	let routes = null;
	if (roomData.building && roomData.floor && roomData.room) {
		try {
			const routeDocument = await RouteData.findOne({
				building: roomData.building,
				floor: roomData.floor,
				room: roomData.room,
			});

			if (routeDocument) {
				routes = Object.fromEntries(routeDocument.routes);
			}
		} catch (error) {
			console.error("[KGU EV Guide] Error fetching route data:", error);
		}
	}

	// 部屋番号が正しい場合、データを取得して表示
	return res.render(`pages/search`, {
		pageTitle: "検索結果",
		room: roomData.room ? roomData.room : room,
		routes: routes,
	});
});

app.get("/report", async (req, res) => {
	res.render(`pages/report`, {
		pageTitle: "経路情報報告フォーム",
	});
});

app.post("/api/routeDataSubmit", async (req, res) => {
	// データの受け取り
	let { room, EV, stairs, orderOfPriority } = req.body;

	// 部屋番号から他データを取得
	let roomData = await checkRoomID(room);
	if (!roomData.correct) {
		return res
			.status(400)
			.send("部屋番号が誤っています。修正して再度お試しください。");
	}

	try {
		// 既存のルートドキュメントを取得または新規作成
		let routeDocument = await RouteData.findOne({
			building: roomData.building,
			floor: roomData.floor,
			room: room,
		});

		if (!routeDocument) {
			routeDocument = new RouteData({
				building: roomData.building,
				floor: roomData.floor,
				room: room,
				routes: new Map(),
			});
		}

		// データが重複しないように確認
		const existingRoutes = Object.fromEntries(routeDocument.routes);
		for (let routeKey in existingRoutes) {
			const route = existingRoutes[routeKey];
			if (
				route.EV === EV &&
				route.stairs === stairs &&
				route.orderOfPriority === orderOfPriority
			) {
				return res.status(400).send("その経路情報はすでに登録されています。");
			}
		}

		// 新しいルートを追加
		const routeCount = routeDocument.routes.size;
		const newRouteKey = `route${routeCount + 1}`;
		routeDocument.routes.set(newRouteKey, {
			EV: EV,
			stairs: stairs,
			orderOfPriority: orderOfPriority,
		});

		// MongoDBに保存
		await routeDocument.save();

		// Discord webhook通知
		const webhookURL = process.env.Discord_Webhook_URL;
		if (!webhookURL) {
			console.error(
				"[ERROR] Discord Webhook URL is not set. Please set on .env file."
			);
			console.info(`[INFO] Route data submitted: ${JSON.stringify(req.body)}`);
		} else {
			const webhookData = {
				content: `新しい経路情報が登録されました。\n部屋番号: ${room}\nEV: ${EV}\n階段: ${stairs}\n優先度: ${orderOfPriority}`,
			};

			try {
				await fetch(webhookURL, {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(webhookData),
				});
			} catch (error) {
				console.error("[ERROR] Failed to send Discord webhook:", error);
				console.info(
					`Discord webhookの送信に失敗しました。送信に失敗した登録データ: ${JSON.stringify(
						req.body
					)}`
				);
			}
		}

		return res.status(200).send("データの登録に成功しました。");
	} catch (error) {
		console.error("[KGU EV Guide] Error saving route data:", error);
		return res.status(500).send("データベースエラーが発生しました。");
	}
});

// MongoDB接続とデータ初期化
async function startApplication() {
	try {
		// MongoDB接続
		await connectDB();

		// データベースが空の場合、JSONファイルから初期化
		const existingData = await RouteData.countDocuments();
		if (existingData === 0) {
			await initializeRouteDataFromJSON();
		}

		// 定期同期開始
		startPeriodicSync();

		// サーバー開始
		app.listen(port, function () {
			console.log(`[KGU EV Guide] Application Listening on Port ${port}`);
		});
	} catch (error) {
		console.error("[KGU EV Guide] Failed to start application:", error);
		process.exit(1);
	}
}
startApplication();

// Graceful shutdown
process.on("SIGINT", async () => {
	console.log("\n[KGU EV Guide] Received SIGINT. Graceful shutdown...");
	try {
		await syncMongoDBToJSON();
		await mongoose.connection.close();
		console.log("[KGU EV Guide] MongoDB connection closed.");
		process.exit(0);
	} catch (error) {
		console.error("[KGU EV Guide] Error during shutdown:", error);
		process.exit(1);
	}
});

process.on("SIGTERM", async () => {
	console.log("\n[KGU EV Guide] Received SIGTERM. Graceful shutdown...");
	try {
		await mongoose.connection.close();
		console.log("[KGU EV Guide] MongoDB connection closed.");
		process.exit(0);
	} catch (error) {
		console.error("[KGU EV Guide] Error during shutdown:", error);
		process.exit(1);
	}
});
