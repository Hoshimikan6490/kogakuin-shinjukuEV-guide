const express = require("express");
const app = express();
const fs = require("fs");
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

// ポートの設定
let port = 80;

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
    let floor = roomID.split("-")[1].substring(0, 2).replace(/^0+/, "");

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
    if (roomID) {
      // 正しい部屋番号形式であり、その部屋が存在するか確認
      if (isAvailableRoomID(roomDB, roomID)) {
        return (roomInfo = {
          correct: true,
          building: roomID.split("-")[0],
          floor: String(Number(roomID.split("-")[1].substring(0, 2))),
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
  let routeData = fs.readFileSync(`${__dirname}/db/routeData.json`, "utf-8");
  routeData = JSON.parse(routeData);

  // 部屋番号の指定が無い場合はrootページにリダイレクト
  if (!room) {
    return res.redirect("/");
  }

  // 部屋番号から他データを取得
  let roomData = await checkRoomID(room);
  if (!roomData.correct) {
    return res.status(400).send("Invalid room number format.");
  }

  // 部屋番号が正しい場合、データを取得して表示
  return res.render(`pages/search`, {
    pageTitle: "検索結果",
    room: roomData.room ? roomData.room : room,
    routes:
      !roomData.building || !roomData.floor || !roomData.room
        ? null
        : routeData[roomData?.building][roomData?.floor][roomData?.room],
  });
});

app.get("/report", (req, res) => {
  let roomID = req.query.room;
  if (!roomID || !roomID.match(/^[AB]-\d{4}$/)) {
    // 部屋番号が不正な場合はエラーを返す
    return res.status(400).send("Invalid room number format.");
  }

  res.render(`pages/report`, {
    pageTitle: "経路情報報告フォーム",
    roomID: roomID,
  });
});

// 次回TODO。データ追加時にDiscord webhookで通知を送る
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

  // DB書き込み
  let routeData = fs.readFileSync(`${__dirname}/db/routeData.json`, "utf-8");
  routeData = JSON.parse(routeData);
  // データが重複しないように確認
  let routes = routeData[roomData.building][roomData.floor][room];
  for (let route in routes) {
    if (
      routes[route].EV === EV &&
      routes[route].stairs === stairs &&
      routes[route].orderOfPriority === orderOfPriority
    ) {
      return res.status(400).send("その経路情報はすでに登録されています。");
    }
  }

  // 登録・書き込み
  let routeCount = Object.keys(
    routeData[roomData.building][roomData.floor]
  ).length;
  routeData[roomData.building][roomData.floor][room][`route${routeCount + 1}`] =
    {
      EV: EV,
      stairs: stairs,
      orderOfPriority: orderOfPriority,
    };
  fs.writeFileSync(`${__dirname}/db/routeData.json`, JSON.stringify(routeData));

  // Discord webhook通知
  // TODO: 追加

  return res.status(200).send("データの登録に成功しました。");
});

app.listen(port, function () {
  console.log(`[KGU EV Guide] Application Listening on Port ${port}`);
});
