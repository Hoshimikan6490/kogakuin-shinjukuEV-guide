const express = require("express");
const app = express();
const fs = require("fs").promises;
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
    let floor = roomID.split("-")[1].substring(0, 2);
    let roomNumber = roomID.split("-")[1].substring(2);

    // 建物が存在するか確認
    if (roomDB[building]) {
      // フロアが存在するか確認
      if (roomDB[building][floor]) {
        // 部屋番号が存在するか確認
        return roomDB[building][floor].includes(roomNumber);
      }
    }

    // どれかが存在しない場合はfalseを返す
    return false;
  }
}

// 各種ルーティングとCGIの設定
app.get("/", (req, res) => {
  res.render(`pages/index`, { pageTitle: "ホーム" });
});

app.get("/api/roomData", async (req, res) => {
  try {
    let roomDB = await fs.readFile(`${__dirname}/db/roomData.json`, "utf-8");
    roomDB = JSON.parse(roomDB);

    // 部屋番号から他の情報を取得する
    let roomID = req.query.room;
    if (roomID) {
      // 正しい部屋番号形式であり、その部屋が存在するか確認
      if (isAvailableRoomID(roomDB, roomID)) {
        let roomInfo = {};
        roomInfo.correct = true;
        roomInfo.building = roomID.split("-")[0];
        roomInfo.floor = String(Number(roomID.split("-")[1].substring(0, 2)));
        roomInfo.room = roomID;
        return res.send(roomInfo);
      } else {
        return res.send({ correct: false });
      }
    }

    // 建物やフロア番号から取得する
    let building = req.query.building;
    let floor = req.query.floor;
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
      roomDB = roomDB[building];
      if (!roomDB) {
        roomDB = {};
      }
    } else if (building && floor) {
      // 階と建物の両方の指定があった場合
      roomDB = roomDB[building][floor];
    }
    return res.send(roomDB);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/search", async (req, res) => {
  let room = req.query.room;
  let routeData = await fs.readFile(`${__dirname}/db/routeData.json`, "utf-8");
  routeData = JSON.parse(routeData);

  // 部屋番号から他データを取得
  await fetch(`http://localhost:${port}/api/roomData?room=${room}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      return res.render(`pages/search`, {
        pageTitle: "検索結果",
        room: data.room ? data.room : room,
        routes:
          !data.building || !data.floor || !data.room
            ? null
            : routeData[data?.building][data?.floor][data?.room],
      });
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
  console.log(req.body);
  let { room, EV, stairs, orderOfPriority } = req.body;

  // 教室番号チェック
  let roomData = await fetch(
    `http://localhost:${port}/api/roomData?room=${room}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  roomData = await roomData.json();
  if (!roomData.correct) {
    return res.status(400).send("Invalid room number.");
  }

  // DB書き込み
  // TODO: 追加

  // Discord webhook通知
  // TODO: 追加

  return res.status(200).send("Data submitted successfully.");
});

app.listen(port, function () {
  console.log(`[KGU EV Guide] Application Listening on Port ${port}`);
});
