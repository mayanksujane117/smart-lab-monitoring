// client.js

const axios =
require("axios");

const os =
require("os");

const si =
require("systeminformation");

const io =
require("socket.io-client");

const activeWin =
require("active-win");

const {

  exec,

} = require("child_process");

// ==========================
// SERVER URL
// ==========================

const SERVER =
"https://smart-lab-monitoring.onrender.com";

// ==========================
// SOCKET CONNECT
// ==========================

const socket =
io(SERVER);

// ==========================
// GET IP ADDRESS
// ==========================

function getIPAddress() {

  const networkInterfaces =
  os.networkInterfaces();

  let ipAddress =
  "Unknown";

  for (const interfaceName in networkInterfaces) {

    const interfaces =
    networkInterfaces[
      interfaceName
    ];

    for (const iface of interfaces) {

      if (

        iface.family ===
        "IPv4" &&

        !iface.internal

      ) {

        ipAddress =
        iface.address;

      }

    }

  }

  return ipAddress;

}

// ==========================
// HEARTBEAT FUNCTION
// ==========================

async function sendHeartbeat() {

  try {

    // ==========================
    // CPU
    // ==========================

    const cpuData =
    await si.currentLoad();

    const cpuUsage =
    cpuData.currentLoad.toFixed(
      0
    );

    // ==========================
    // RAM
    // ==========================

    const memData =
    await si.mem();

    const ramUsage =
    (

      (
        memData.used /
        memData.total
      ) * 100

    ).toFixed(0);

    // ==========================
    // INTERNET
    // ==========================

    const networkData =
    await si.networkStats();

    const internetSpeed =
    (

      networkData[0]
      ?.rx_sec / 1024

    ).toFixed(2);

    // ==========================
    // ACTIVE APP
    // ==========================

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

      console.log(
        "⚠ Active App Error"
      );

    }

    // ==========================
    // SEND DATA
    // ==========================

    await axios.post(

      `${SERVER}/api/heartbeat`,

      {

        pcName:
        os.hostname(),

        lab:
        "Lab 1",

        ipAddress:
        getIPAddress(),

        status:
        "Online",

        cpuUsage,

        ramUsage,

        internetSpeed,

        activeApp,

        lastSeen:
        new Date(),

      }

    );

    console.log(
      "💓 Heartbeat Sent"
    );

  }

  catch (error) {

    console.log(
      "❌ Heartbeat Error"
    );

    console.log(

      error.response?.data ||
      error.message

    );

  }

}

// ==========================
// SEND EVERY 5 SEC
// ==========================

sendHeartbeat();

setInterval(

  sendHeartbeat,

  5000

);

// ==========================
// SHUTDOWN SINGLE PC
// ==========================

socket.on(

  "shutdown-pc",

  (pcName) => {

    if (

      pcName ===
      os.hostname()

    ) {

      console.log(
        "⚠ Shutdown Command Received"
      );

      exec(
        "shutdown /s /t 0"
      );

    }

  }

);

// ==========================
// SHUTDOWN ALL PCs
// ==========================

socket.on(

  "shutdown-all",

  () => {

    console.log(
      "⚠ Shutdown ALL PCs"
    );

    exec(
      "shutdown /s /t 0"
    );

  }

);

// ==========================
// RESTART PC
// ==========================

socket.on(

  "restart-pc",

  (pcName) => {

    if (

      pcName ===
      os.hostname()

    ) {

      console.log(
        "🔄 Restart Command"
      );

      exec(
        "shutdown /r /t 0"
      );

    }

  }

);

// ==========================
// LOCK PC
// ==========================

socket.on(

  "lock-pc",

  (pcName) => {

    if (

      pcName ===
      os.hostname()

    ) {

      console.log(
        "🔒 Lock Command"
      );

      exec(

        "rundll32.exe user32.dll,LockWorkStation"

      );

    }

  }

);

// ==========================
// SLEEP PC
// ==========================

socket.on(

  "sleep-pc",

  (pcName) => {

    if (

      pcName ===
      os.hostname()

    ) {

      console.log(
        "😴 Sleep Command"
      );

      exec(

        "rundll32.exe powrprof.dll,SetSuspendState 0,1,0"

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
          os.hostname(),

          status:
          "Offline",

        }

      );

    }

    catch {}

    process.exit();

  }

);

// ==========================
// START MESSAGE
// ==========================

console.log(

  " Smart Lab Agent Running"

);

console.log(

  "💻 PC Name:",

  os.hostname()

);

console.log(

  " Connected To:",

  SERVER

);