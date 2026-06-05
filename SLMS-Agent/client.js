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

const fs =
require("fs");

const {
  exec,
} =
require("child_process");

// ==========================
// CONFIG
// ==========================

const config =
JSON.parse(

  fs.readFileSync(
    "./config.json",
    "utf8"
  )

);

const SERVER =
"https://smart-lab-monitoring.onrender.com";

// ==========================
// SOCKET
// ==========================

const socket =
io(SERVER);

// ==========================
// GET IP
// ==========================

function getIPAddress() {

  const interfaces =
    os.networkInterfaces();

  for (const name in interfaces) {

    for (
      const iface of interfaces[name]
    ) {

      if (

        iface.family ===
          "IPv4" &&

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

    catch {}

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
            cpuData.currentLoad.toFixed(
              0
            )
          ),

        ramUsage:
          Number(

            (

              memData.used /

              memData.total

            ) * 100

          ).toFixed(0),

        internetSpeed:
          Number(

            (
              networkData[0]
                ?.rx_sec / 1024
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

  }

}

// ==========================
// START
// ==========================

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
// START MESSAGE
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