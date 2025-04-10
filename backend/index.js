module.exports = async () => {
  const express = require("express");
  const app = express();
  const path = require("path");
  const fs = require("fs").promises;

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
};
