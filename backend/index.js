const express = require("express");
const app = express();
const cors = require("cors");
const fs = require("fs").promises;
require("dotenv").config();

const frontendApiUrl = process.env.FRONTEND_API_URL;

// CORSの有効化
app.use(cors({ origin: `http://${frontendApiUrl}` }));

app.get("/roomData", async function (req, res) {
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

app.listen(3030, function () {
  console.log(`[backend] Application Listening on Port 3030`);
});
