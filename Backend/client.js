// client.js

const axios = require("axios");

const os = require("os");

const si =
require("systeminformation");

const io =
require("socket.io-client");

const {
  exec,
} = require("child_process");

// ==========================
// SOCKET CONNECT
// ==========================

const socket = io(
  "https://smart-lab-monitoring.onrender.com"
);

// ==========================
// GET IP ADDRESS
// ==========================

const networkInterfaces =
os.networkInterfaces();

let ipAddress = "Unknown";

for (const interfaceName in networkInterfaces) {

  const interfaces =
  networkInterfaces[
    interfaceName
  ];

  for (const iface of interfaces) {

    if (

      iface.family === "IPv4" &&

      !iface.internal

    ) {

      ipAddress =
      iface.address;

    }

  }

}

console.log(
  "🌐 IP Address:",
  ipAddress
);

// ==========================
// HEARTBEAT FUNCTION
// ==========================

async function sendHeartbeat() {

  try {

    // CPU

    const cpu =
    await si.currentLoad();

    // RAM

    const mem =
    await si.mem();

    // INTERNET

    const network =
    await si.networkStats();

    const internetSpeed =
    (
      network[0]?.rx_sec /
      1024
    ).toFixed(2);

    // SEND DATA

    await axios.post(

      "https://smart-lab-monitoring.onrender.com/api/heartbeat",

      {

        pcName:
        os.hostname(),

        lab: "Lab 1",

        ipAddress,

        status:
        "Online",

        cpuUsage:
        cpu.currentLoad.toFixed(0),

        ramUsage:
        (
          (
            mem.used /
            mem.total
          ) * 100
        ).toFixed(0),

        internetSpeed,

      }

    );

    console.log(
      "💓 Heartbeat Sent"
    );

  }

  catch (error) {

    console.log(
      "❌ Error:",
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
// SHUTDOWN LISTENER
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
// RESTART LISTENER
// ==========================

socket.on(

  "restart-pc",

  (pcName) => {

    if (

      pcName ===
      os.hostname()

    ) {

      console.log(
        "🔄 Restart Command Received"
      );

      exec(
        "shutdown /r /t 0"
      );

    }

  }

);

// ==========================
// LOCK LISTENER
// ==========================

socket.on(

  "lock-pc",

  (pcName) => {

    if (

      pcName ===
      os.hostname()

    ) {

      console.log(
        "🔒 Lock Command Received"
      );

      exec(
        "rundll32.exe user32.dll,LockWorkStation"
      );

    }

  }

);

// ==========================
// SLEEP LISTENER
// ==========================

socket.on(

  "sleep-pc",

  (pcName) => {

    if (

      pcName ===
      os.hostname()

    ) {

      console.log(
        "😴 Sleep Command Received"
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

        "https://smart-lab-monitoring.onrender.com/api/heartbeat",

        {

          pcName:
          os.hostname(),

          lab: "Lab 1",

          ipAddress,

          status:
          "Offline",

        }

      );

    }

    catch {}

    process.exit();

  }

);