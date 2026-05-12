const express = require("express");

const mongoose = require("mongoose");

const cors = require("cors");

const http = require("http");

const { Server } = require("socket.io");

require("dotenv").config();

// ==========================
// IMPORT MODELS
// ==========================

const PC = require("./models/PC");

const SystemLog =
require("./models/SystemLog");

// ==========================
// APP SETUP
// ==========================

const app = express();

const server =
http.createServer(app);

const io = new Server(server, {

  cors: {
    origin: "*",
  },

});

// ==========================
// MIDDLEWARE
// ==========================

app.use(cors());

app.use(
  express.json({
    limit: "50mb",
  })
);

// ==========================
// MONGODB CONNECT
// ==========================

mongoose
.connect(process.env.MONGO_URI)

.then(() => {

  console.log(
    "✅ MongoDB Connected"
  );

})

.catch((err) => {

  console.log(
    "❌ MongoDB Error"
  );

  console.log(err);

});

// ==========================
// SOCKET CONNECTION
// ==========================

io.on(
  "connection",

  (socket) => {

    console.log(
      "⚡ User Connected:",
      socket.id
    );

    socket.on(
      "disconnect",

      () => {

        console.log(
          "❌ User Disconnected:",
          socket.id
        );

      }
    );

  }
);

// ==========================
// HEARTBEAT API
// ==========================

app.post(

  "/api/heartbeat",

  async (req, res) => {

    try {

      const {

        pcName,
        lab,
        ipAddress,
        status,
        cpuUsage,
        ramUsage,
        internetSpeed,

      } = req.body;

      let pc =
      await PC.findOne({
        pcName,
      });

      // ==========================
      // UPDATE EXISTING PC
      // ==========================

      if (pc) {

        pc.lab = lab;

        pc.ipAddress =
        ipAddress;

        pc.status =
        status;

        pc.cpuUsage =
        Number(cpuUsage);

        pc.ramUsage =
        Number(ramUsage);

        pc.internetSpeed =
        Number(internetSpeed);

        pc.lastSeen =
        new Date();

        await pc.save();

      }

      // ==========================
      // CREATE NEW PC
      // ==========================

      else {

        pc =
        await PC.create({

          pcName,

          lab,

          ipAddress,

          status,

          cpuUsage:
          Number(cpuUsage),

          ramUsage:
          Number(ramUsage),

          internetSpeed:
          Number(internetSpeed),

          lastSeen:
          new Date(),

        });

      }

      // ==========================
      // SAVE HISTORY
      // ==========================

      await SystemLog.create({

        pcName,

        cpuUsage:
        Number(cpuUsage),

        ramUsage:
        Number(ramUsage),

        internetSpeed:
        Number(internetSpeed),

        status,

      });

      // ==========================
      // REALTIME UPDATE
      // ==========================

      io.emit(
        "pc-update",
        pc
      );

      res.json({

        success: true,

        message:
        "Heartbeat Received",

      });

    }

    catch (error) {

      console.log(error);

      res.status(500).json({

        success: false,

      });

    }

  }
);

// ==========================
// GET ALL PCS
// ==========================

app.get(

  "/api/pcs",

  async (req, res) => {

    try {

      const pcs =
      await PC.find();

      res.json(pcs);

    }

    catch (error) {

      console.log(error);

      res.status(500).json({

        success: false,

      });

    }

  }
);

// ==========================
// GET HISTORY
// ==========================

app.get(

  "/api/history/:pcName",

  async (req, res) => {

    try {

      const history =
      await SystemLog.find({

        pcName:
        req.params.pcName,

      })

      .sort({
        createdAt: -1,
      })

      .limit(20);

      res.json(history);

    }

    catch (error) {

      console.log(error);

      res.status(500).json({

        success: false,

      });

    }

  }
);

// ==========================
// REMOTE SHUTDOWN
// ==========================

app.post(

  "/api/shutdown",

  async (req, res) => {

    try {

      const { pcName } =
      req.body;

      io.emit(
        "shutdown-pc",
        pcName
      );

      console.log(
        `⚠ Shutdown Sent To ${pcName}`
      );

      res.json({

        success: true,

        message:
        "Shutdown Command Sent",

      });

    }

    catch (error) {

      console.log(error);

      res.status(500).json({

        success: false,

      });

    }

  }
);

// ==========================
// AUTO STATUS CHECKER
// ==========================

setInterval(async () => {

  try {

    const pcs =
    await PC.find();

    const now =
    Date.now();

    for (const pc of pcs) {

      const diff =
      now -
      new Date(
        pc.lastSeen
      ).getTime();

      // ONLINE

      if (diff < 15000) {

        pc.status =
        "Online";

      }

      // SLEEPING

      else if (
        diff < 120000
      ) {

        pc.status =
        "Sleeping";

      }

      // OFFLINE

      else {

        pc.status =
        "Offline";

      }

      await pc.save();

      io.emit(
        "pc-update",
        pc
      );

    }

  }

  catch (error) {

    console.log(error);

  }

}, 5000);

// ==========================
// SERVER START
// ==========================

const PORT =
process.env.PORT || 5000;

server.listen(PORT, () => {

  console.log(
    `🚀 Server Running On Port ${PORT}`
  );

});