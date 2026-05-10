const axios = require("axios");
const os = require("os");

// Get Network Interfaces
const networkInterfaces = os.networkInterfaces();

let ipAddress = "Unknown";

// Find IPv4 Address
for (const interfaceName in networkInterfaces) {

  const interfaces =
    networkInterfaces[interfaceName];

  for (const iface of interfaces) {

    if (
      iface.family === "IPv4" &&
      !iface.internal
    ) {

      ipAddress = iface.address;

    }
  }
}

console.log("🌐 IP Address:", ipAddress);

// Send Heartbeat Every 5 Seconds
setInterval(async () => {

  try {

    await axios.post(
      "http://localhost:5000/api/heartbeat",
      {
        pcName: os.hostname(),
        lab: "Lab 1",
        ipAddress: ipAddress,
        status: "Online",
      }
    );

    console.log("💓 Heartbeat Sent");

  } catch (error) {

    console.log(error.message);

  }

}, 5000);