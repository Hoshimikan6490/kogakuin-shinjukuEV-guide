module.exports = async () => {
  const express = require("express");
  const app = express();
  const path = require("path");

  app.use("/images", express.static(`${__dirname}/images`));

  app.get("/style.css", async function (req, res) {
    res.sendFile(`${__dirname}/page/style.css`);
  });

  app.get("/script/goTop.js", async function (req, res) {
    res.sendFile(`${__dirname}/page/script/goTop.js`);
  });

  app.get("/script/select.js", async function (req, res) {
    res.sendFile(`${__dirname}/page/script/select.js`);
  });

  app.get("/", (req, res) => {
    res.sendFile(`${__dirname}/page/index.html`);
  });

  app.listen(3000, function () {
    console.log(`[NodeJS] Application Listening on Port 3000`);
  });
};
