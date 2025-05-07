const { fork } = require("child_process");
const fs = require("fs");

const PID_FILE = "./server.pid";

function startServer() {
  const child = fork("app.js", {
    detached: true,
    stdio: "ignore",
  });

  child.unref();

  fs.writeFileSync(PID_FILE, child.pid.toString(), "utf-8");
  console.log(`Server started with PID ${child.pid}`);
}

function stopServer() {
  if (!fs.existsSync(PID_FILE)) {
    console.log("No server running.");
    return;
  }

  const pid = parseInt(fs.readFileSync(PID_FILE, "utf-8"), 10);
  try {
    process.kill(pid, "SIGTERM");
    fs.unlinkSync(PID_FILE);
    console.log(`Server with PID ${pid} stopped.`);
  } catch (err) {
    console.error("Failed to stop server:", err);
  }
}

function restartServer() {
  stopServer();
  setTimeout(() => {
    startServer();
  }, 1000);
}

// 使用例：コマンド引数で制御
const cmd = process.argv[2];

if (cmd === "start") startServer();
else if (cmd === "stop") stopServer();
else if (cmd === "restart") restartServer();
else console.log("Usage: node main.js [start|stop|restart]");
