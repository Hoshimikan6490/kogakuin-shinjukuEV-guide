const express = require("express");
const app = express();
const fs = require("fs").promises;
const path = require("path");

let port = 80;

// publicディレクトリを静的ファイルのルートとして設定
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(`${__dirname}/views/index.html`);
});

app.get("/roomData", async (req, res) => {
  try {
    let room = await fs.readFile(`${__dirname}/roomData.json`, "utf-8");
    room = JSON.parse(room);

    let building = req.query.building;
    let floor = req.query.floor;
    if (!building && floor) {
      // 階の指定のみがあった場合
      room.A = {
        [floor]: room.A[floor],
      };
      room.B = {
        [floor]: room.B[floor],
      };
    } else if (building && !floor) {
      // 建物の指定のみがあった場合
      room = room[building];
      if (!room) {
        room = {};
      }
    } else if (building && floor) {
      // 階と建物の両方の指定があった場合
      room = room[building][floor];
    }
    return res.send(room);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(port, function () {
  console.log(`[KGU EV Guide] Application Listening on Port ${port}`);
});
