const express = require("express");
const app = express();
const fs = require("fs").promises;
const path = require("path");
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

// ポートの設定
let port = 80;

// View engineをejsに設定
app.set("view engine", "ejs");

// 必要なデータを準備
app.use(express.static("views"));
app.use("views", express.static("views"));

app.get("/", (req, res) => {
  res.render(`pages/index`);
});

app.get("/roomData", async (req, res) => {
  try {
    let roomDB = await fs.readFile(`${__dirname}/db/roomData.json`, "utf-8");
    roomDB = JSON.parse(roomDB);

    // 部屋番号から他の情報を取得する
    let roomNumber = req.query.room;
    // 正しい部屋番号形式か確認
    if (roomNumber) {
      if (roomNumber.match(/^[AB]-\d{4}$/)) {
        let roomInfo = {};
        roomInfo.building = roomNumber.split("-")[0];
        roomInfo.floor = String(
          Number(roomNumber.split("-")[1].substring(0, 2))
        );
        roomInfo.room = roomNumber;
        return res.send(roomInfo);
      } else {
        return res.send({});
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
  await fetch(`http://localhost:${port}/roomData?room=${room}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      return res.send(routeData[data.building][data.floor][data.room]);
    });
});

app.listen(port, function () {
  console.log(`[KGU EV Guide] Application Listening on Port ${port}`);
});
