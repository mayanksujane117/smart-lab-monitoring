  // server.js

  require("dotenv").config();

  const express =
  require("express");

  const mongoose =
  require("mongoose");

  const cors =
  require("cors");

  const http =
  require("http");

  const bcrypt =
  require("bcryptjs");

  const jwt =
  require("jsonwebtoken");

  const {

    Server,

  } = require("socket.io");

  const PC =
  require("./models/PC");

  const SystemLog =
  require("./models/SystemLog");

  const User =
  require("./models/User");

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

    process.env.MONGO_URI

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
  // REGISTER
  // ==========================

  app.post(

    "/api/register",

    async (req, res) => {

      try {

        const {

          username,
          password,
          confirmPassword,

        } = req.body;

        // PASSWORD MATCH

        if (

          password !==
          confirmPassword

        ) {

          return res.status(400).json({

            success: false,

            message:
            "Passwords do not match",

          });

        }

        // CHECK USER EXISTS

        const existingUser =
        await User.findOne({

          username,

        });

        if (existingUser) {

          return res.status(400).json({

            success: false,

            message:
            "User already exists",

          });

        }

        // HASH PASSWORD

        const hashedPassword =
        await bcrypt.hash(

          password,

          10

        );

        // CREATE USER

        const user =
        await User.create({

          username,

          password:
          hashedPassword,

        });

        res.json({

          success: true,

          user,

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
  // LOGIN
  // ==========================

  app.post(

    "/api/login",

    async (req, res) => {

      try {

        const {

          username,
          password,

        } = req.body;

        const user =
        await User.findOne({

          username,

        });

        if (!user) {

          return res.status(400).json({

            success: false,

            message:
            "User not found",

          });

        }

        const isMatch =
        await bcrypt.compare(

          password,

          user.password

        );

        if (!isMatch) {

          return res.status(400).json({

            success: false,

            message:
            "Wrong Password",

          });

        }

        // TOKEN

        const token =
        jwt.sign(

          {

            id: user._id,

          },

          "secretkey",

          {

            expiresIn: "7d",

          }

        );

        res.json({

          success: true,

          token,

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
  // FORGOT PASSWORD
  // ==========================

  app.post(

    "/api/forgot-password",

    async (req, res) => {

      try {

        const {

          username,
          newPassword,

        } = req.body;

        const user =
        await User.findOne({

          username,

        });

        if (!user) {

          return res.status(404).json({

            success: false,

            message:
            "User not found",

          });

        }

        // HASH PASSWORD

        const hashedPassword =
        await bcrypt.hash(

          newPassword,

          10

        );

        user.password =
        hashedPassword;

        await user.save();

        res.json({

          success: true,

          message:
          "Password Updated",

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

        // UPDATE PC

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

        // SAVE LOG

        await SystemLog.create({

          pcName,

          cpuUsage,

          ramUsage,

          internetSpeed,

          status,

        });

        // REALTIME UPDATE

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
  // DELETE PC
  // ==========================

  app.delete(

    "/api/delete-pc/:pcName",

    async (req, res) => {

      try {

        const pcName =
        req.params.pcName;

        await PC.deleteOne({

          pcName,

        });

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
  // AUTO OFFLINE CHECK
  // ==========================

  setInterval(

    async () => {

      try {

        const oneMinuteAgo =
        new Date(

          Date.now() -
          1000 * 60 * 1

        );

        await PC.updateMany(

          {

            lastSeen: {

              $lt:
              oneMinuteAgo,

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
  // ROOT ROUTE
  // ==========================

  app.get(

    "/",

    (req, res) => {

      res.send(

        "🚀 Smart Lab Monitoring Backend Running"

      );

    }

  );

  // ==========================
  // PORT
  // ==========================

  const PORT =
  process.env.PORT || 5000;

  server.listen(

    PORT,

    () => {

      console.log(

        `🚀 Server Running On Port ${PORT}`

      );

    }

  );