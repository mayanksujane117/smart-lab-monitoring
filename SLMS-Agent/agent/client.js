const axios = require("axios");
const os = require("os");
const si = require("systeminformation");
const io = require("socket.io-client");
const activeWin = require("active-win");
const fs = require("fs");
const path = require("path");

const { exec } = require("child_process");

// ==========================
// CONFIG
// ==========================

const configPath =
path.join(
  __dirname,
  "config.json"
);

const config =
JSON.parse(
  fs.readFileSync(
    configPath,
    "utf8"
  )
);

// ==========================
// SERVER
// ==========================

const SERVER =
"https://smart-lab-monitoring.onrender.com";

// ==========================
// SOCKET
// ==========================

const socket =
io(SERVER);

// ==========================
// GET IP ADDRESS
// ==========================

function getIPAddress() {

  const interfaces =
  os.networkInterfaces();

  for (const name in interfaces) {

    for (const iface of interfaces[name]) {

      if (
        iface.family === "IPv4" &&
        !iface.internal
      ) {

        return iface.address;

      }

    }

  }

  return "Unknown";

}

// ==========================
// HEARTBEAT
// ==========================

async function sendHeartbeat() {

  try {

    const cpuData =
    await si.currentLoad();

    const memData =
    await si.mem();

    const networkData =
    await si.networkStats();

    let activeApp =
    "Unknown";

    try {

      const active =
      await activeWin();

      activeApp =
      active?.title ||
      "Unknown";

    }

    catch {

      activeApp =
      "Unknown";

    }

    await axios.post(

      `${SERVER}/api/heartbeat`,

      {

        pcName:
        config.pcName,

        lab:
        config.lab,

        ipAddress:
        getIPAddress(),

        status:
        "Online",

        cpuUsage:
        Number(
          cpuData.currentLoad.toFixed(0)
        ),

        ramUsage:
        Number(

          (
            (
              memData.used /
              memData.total
            ) * 100
          ).toFixed(0)

        ),

        internetSpeed:
        Number(

          (
            (
              networkData[0]?.rx_sec || 0
            ) / 1024
          ).toFixed(2)

        ),

        activeApp,

        lastSeen:
        new Date(),

      }

    );

    console.log(
      `[${config.pcName}] Heartbeat Sent`
    );

  }

  catch (error) {

    console.log(
      "Heartbeat Error"
    );

    console.log(
      error.response?.data ||
      error.message
    );

  }

}

// ==========================
// START
// ==========================

console.log(
  "SLMS Agent Running"
);

console.log(
  "PC:",
  config.pcName
);

console.log(
  "Lab:",
  config.lab
);

sendHeartbeat();

setInterval(
  sendHeartbeat,
  5000
);

// ==========================
// SHUTDOWN
// ==========================

socket.on(

  "shutdown-pc",

  (pcName) => {

    if (
      pcName ===
      config.pcName
    ) {

      exec(
        "shutdown /s /t 0"
      );

    }

  }

);

// ==========================
// SHUTDOWN ALL
// ==========================

socket.on(

  "shutdown-all",

  () => {

    exec(
      "shutdown /s /t 0"
    );

  }

);

// ==========================
// RESTART
// ==========================

socket.on(

  "restart-pc",

  (pcName) => {

    if (
      pcName ===
      config.pcName
    ) {

      exec(
        "shutdown /r /t 0"
      );

    }

  }

);

// ==========================
// LOCK
// ==========================

socket.on(

  "lock-pc",

  (pcName) => {

    if (
      pcName ===
      config.pcName
    ) {

      exec(
        "rundll32.exe user32.dll,LockWorkStation"
      );

    }

  }

);

// ==========================
// OFFLINE DETECTION
// ==========================

process.on(

  "SIGINT",

  async () => {

    try {

      await axios.post(

        `${SERVER}/api/heartbeat`,

        {

          pcName:
          config.pcName,

          status:
          "Offline",

        }

      );

    }

    catch {}

    process.exit();

  }

);