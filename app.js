const backend = require("./backend/index.js");
const frontend = require("./frontend/index.js");

(async () => {
  try {
    await Promise.all([backend(), frontend()]);
  } catch (error) {
    console.error(error);
  }
})();
