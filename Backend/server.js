// server.js

const express =
require("express");

const mongoose =
require("mongoose");

const cors =
require("cors");

const http =
require("http");

const {

  Server,

} = require("socket.io");

const PC =
require("./models/PC");

const SystemLog =
require("./models/SystemLog");

// ==========================
// APP
// ==========================

const app =
express();

const server =
http.createServer(app);

// ==========================
// SOCKET IO
// ==========================

const io =
new Server(server, {

  cors: {

    origin: "*",

  },

});

// ==========================
// MIDDLEWARE
// ==========================

app.use(cors());

app.use(express.json({

  limit: "50mb",

}));

// ==========================
// MONGODB
// ==========================

mongoose.connect(

  "mongodb://127.0.0.1:27017/slms"

)

.then(() => {

  console.log(

    "✅ MongoDB Connected"

  );

})

.catch((err) => {

  console.log(err);

});

// ==========================
// SOCKET CONNECTION
// ==========================

io.on(

  "connection",

  (socket) => {

    console.log(

      "⚡ Client Connected"

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
        activeApp,
        screenshot,

      } = req.body;

      // ==========================
      // UPDATE OR CREATE PC
      // ==========================

      const updatedPC =
      await PC.findOneAndUpdate(

        {

          pcName,

        },

        {

          pcName,
          lab,
          ipAddress,
          status,
          cpuUsage,
          ramUsage,
          internetSpeed,
          activeApp,
          screenshot,

          lastSeen:
          new Date(),

        },

        {

          upsert: true,

          new: true,

        }

      );

      // ==========================
      // SAVE LOG
      // ==========================

      await SystemLog.create({

        pcName,

        cpuUsage,

        ramUsage,

        internetSpeed,

        status,

      });

      // ==========================
      // REALTIME UPDATE
      // ==========================

      io.emit(

        "pc-update",

        updatedPC

      );

      res.json({

        success: true,

      });

    }

    catch (error) {

      console.log(error);

      res.status(500).json({

        error:
        "Server Error",

      });

    }

  }

);

// ==========================
// GET PCS
// ==========================

app.get(

  "/api/pcs",

  async (req, res) => {

    try {

      const pcs =
      await PC.find()

      .sort({

        lastSeen: -1,

      });

      res.json(pcs);

    }

    catch (error) {

      console.log(error);

      res.status(500).json({

        error:
        "Server Error",

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

      const logs =
      await SystemLog.find({

        pcName:
        req.params.pcName,

      })

      .sort({

        createdAt: -1,

      })

      .limit(20);

      res.json(logs);

    }

    catch (error) {

      console.log(error);

      res.status(500).json({

        error:
        "Server Error",

      });

    }

  }

);

// ==========================
// SHUTDOWN SINGLE PC
// ==========================

app.post(

  "/api/shutdown",

  (req, res) => {

    const {

      pcName,

    } = req.body;

    io.emit(

      "shutdown-pc",

      pcName

    );

    res.json({

      success: true,

    });

  }

);

// ==========================
// SHUTDOWN ALL PCs
// ==========================

app.post(

  "/api/shutdown-all",

  (req, res) => {

    io.emit(

      "shutdown-all"

    );

    res.json({

      success: true,

    });

  }

);

// ==========================
// AUTO OFFLINE CHECK
// ==========================

setInterval(

  async () => {

    try {

      const fiveMinutesAgo =
      new Date(

        Date.now() -
        1000 * 60 * 1

      );

      await PC.updateMany(

        {

          lastSeen: {

            $lt:
            fiveMinutesAgo,

          },

        },

        {

          status:
          "Offline",

        }

      );

    }

    catch (error) {

      console.log(error);

    }

  },

  10000

);
// ==========================
// DELETE PC
// ==========================

app.delete(

  "/api/delete-pc/:pcName",

  async (req, res) => {

    try {

      const pcName =
      req.params.pcName;

      // DELETE PC

      await PC.deleteOne({

        pcName,

      });

      // DELETE LOGS

      await SystemLog.deleteMany({

        pcName,

      });

      res.json({

        success: true,

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
// PORT
// ==========================

const PORT =
5000;

server.listen(

  PORT,

  () => {

    console.log(

      `🚀 Server Running On Port ${PORT}`

    );

  }

);  