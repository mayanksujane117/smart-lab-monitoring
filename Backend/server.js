// server.js

require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Lab = require("./models/Lab");
const { Server } = require("socket.io");

const PC = require("./models/PC");
const SystemLog = require("./models/SystemLog");
const User = require("./models/User");


// ==========================
// APP
// ==========================

const app = express();

const server = http.createServer(app);

// ==========================
// SOCKET IO
// ==========================

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
// MONGODB
// ==========================

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch((err) => {
    console.log(err);
  });

// ==========================
// SOCKET CONNECTION
// ==========================

const screenshots = {};

io.on("connection", (socket) => {

  console.log("Client Connected");

  socket.on(

    "screenshot-response",

    (data) => {

      screenshots[
        data.pcName
      ] = data.screenshot;

      console.log(
        "Screenshot Received:",
        data.pcName
      );

    }

  );

});
// ==========================
// REGISTER
// ==========================

app.post("/api/register", async (req, res) => {
  try {
    const {
      username,
      password,
      confirmPassword,
    } = req.body;

    // PASSWORD MATCH

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match",
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
        message: "User already exists",
      });
    }

    // HASH PASSWORD

    const hashedPassword =
      await bcrypt.hash(password, 10);

    // CREATE USER

  const user =
  await User.create({

    username,

    password:
      hashedPassword,

    role:
      "Lab Assistant",

    assignedLab:
      "",

  });

res.json({

  success: true,

  user,

});
  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
    });

  }
});

// ==========================
// ADD USER (ADMIN)
// ==========================

app.post("/api/add-user", async (req, res) => {

  try {

   const {

  username,

  password,

  role,

  assignedLabs,

} = req.body;

    if (!username || !password) {

      return res.status(400).json({
        success: false,
        message: "Username and Password required",
      });

    }

    const existingUser =
      await User.findOne({
        username,
      });

    if (existingUser) {

      return res.status(400).json({
        success: false,
        message: "User already exists",
      });

    }

    const hashedPassword =
      await bcrypt.hash(
        password,
        10
      );

    const user =
  await User.create({

    username,

    password:
      hashedPassword,

    role:
      role ||
      "Lab Assistant",

   assignedLabs:
  assignedLabs || [],

  });

    res.status(201).json({

      success: true,

      message:
        "Lab Assistant Created",

      user: {

  id: user._id,

  username:
    user.username,

  role:
    user.role,

  assignedLab:
    user.assignedLabs,

},

    });

  }

  catch (error) {

    console.log(error);

    res.status(500).json({

      success: false,

      message:
        "Server Error",

    });

  }

});

// ==========================
// LOGIN
// ==========================

app.post("/api/login", async (req, res) => {

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
        message: "User not found",
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
        message: "Wrong Password",
      });

    }

    // TOKEN

    const token = jwt.sign(
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

  user: {

    id: user._id,

    username:
      user.username,

    role:
      user.role,

   assignedLabs:
  user.assignedLabs,

  },

});

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
    });

  }
});

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
          message: "User not found",
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
        message: "Password Updated",
      });

    } catch (error) {

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

app.post("/api/heartbeat", async (req, res) => {

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

    // CHECK LAB EXISTS

const labExists =
await Lab.findOne({
  name: lab
});

const finalLab =
labExists
  ? lab
  : "Unassigned";

    // UPDATE PC

    const updatedPC =
      await PC.findOneAndUpdate(

        {
          pcName,
        },

        {
          pcName,
          lab: finalLab,
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

    // SEND ALL PCS

    const allPCs =
      await PC.find().sort({
        lastSeen: -1,
      });

    io.emit(
      "all-pcs-update",
      allPCs
    );

    res.json({
      success: true,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      error: "Server Error",
    });

  }
});



// ==========================
// GET PCS
// ==========================

app.get("/api/pcs", async (req, res) => {

  try {

    const pcs =
      await PC.find().sort({
        lastSeen: -1,
      });

    res.json(pcs);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      error: "Server Error",
    });

  }
});

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

    } catch (error) {

      console.log(error);

      res.status(500).json({
        error: "Server Error",
      });

    }
  }
);

// ==========================
// SHUTDOWN SINGLE PC
// ==========================

app.post("/api/shutdown", (req, res) => {

  const { pcName } =
    req.body;

  io.emit(
    "shutdown-pc",
    pcName
  );

  res.json({
    success: true,
  });

});

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
// SHUTDOWN LAB PCs
// ==========================

app.post(

  "/api/shutdown-lab",

  (req, res) => {

    try {

      const { lab } =
        req.body;

      io.emit(
        "shutdown-lab",
        lab
      );

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
// RESTART PC
// ==========================

app.post(
  "/api/restart",
  (req, res) => {

    const { pcName } =
      req.body;

    io.emit(
      "restart-pc",
      pcName
    );

    res.json({
      success: true,
    });

  }
);

// ==========================
// LOCK PC
// ==========================

app.post(
  "/api/lock",
  (req, res) => {

    const { pcName } =
      req.body;

    io.emit(
      "lock-pc",
      pcName
    );

    res.json({
      success: true,
    });

  }
);

// ==========================
// SLEEP PC
// ==========================

app.post(
  "/api/sleep",
  (req, res) => {

    const { pcName } =
      req.body;

    io.emit(
      "sleep-pc",
      pcName
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

      // UPDATE FRONTEND

      const allPCs =
        await PC.find().sort({
          lastSeen: -1,
        });

      io.emit(
        "all-pcs-update",
        allPCs
      );

      res.json({
        success: true,
      });

    } catch (error) {

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

setInterval(async () => {

  try {

    const oneMinuteAgo =
      new Date(
        Date.now() - 1000 * 60
      );

    await PC.updateMany(

      {
        lastSeen: {
          $lt: oneMinuteAgo,
        },
      },

      {
        status: "Offline",

        cpuUsage: "0",

        ramUsage: "0",

        internetSpeed: "0",

        activeApp: "None",
      }

    );

    // REALTIME UPDATE

    const updatedPCs =
      await PC.find().sort({
        lastSeen: -1,
      });

    io.emit(
      "all-pcs-update",
      updatedPCs
    );

  } catch (error) {

    console.log(error);

  }

}, 5000);

// ==========================
// GET USERS
// ==========================

app.get("/api/users", async (req, res) => {
  try {

    const users =
      await User.find()
      .select("-password");

    res.json(users);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
    });

  }
});

// ==========================
// DELETE USER
// ==========================

app.delete("/api/users/:id", async (req, res) => {
  try {

    await User.findByIdAndDelete(
      req.params.id
    );

    res.json({
      success: true,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
    });

  }
});

// ==========================
// UPDATE USER
// ==========================

app.put(
  "/api/users/:id",
  async (req, res) => {

    try {

      const {

        role,

        assignedLabs,

      } = req.body;

      const updatedUser =
        await User.findByIdAndUpdate(

          req.params.id,

          {

            role,

            assignedLabs,

          },

          {

            new: true,

          }

        );

      res.json({

        success: true,

        user:
          updatedUser,

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
// CHANGE ROLE
// ==========================

app.put("/api/users/:id/role", async (req, res) => {
  try {

    const { role } = req.body;

    const updatedUser =
      await User.findByIdAndUpdate(

        req.params.id,

        { role },

        { new: true }

      );

    res.json(updatedUser);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
    });

  }
});

// ==========================
// ADD LAB
// ==========================

app.post("/api/labs", async (req, res) => {

  try {

    const { name } =
      req.body;

    const exists =
      await Lab.findOne({
        name,
      });

    if (exists) {

      return res.status(400).json({
        success: false,
        message: "Lab already exists",
      });

    }

    const lab =
      await Lab.create({
        name,
      });

    res.json({
      success: true,
      lab,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
    });

  }

}); 
// ==========================
// GET LABS
// ==========================

app.get("/api/labs", async (req, res) => {

  try {

    const labs =
      await Lab.find().sort({
        createdAt: -1,
      });

    res.json(labs);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
    });

  }

});

app.delete(
  "/api/labs/:id",
  async (req, res) => {

    try {

      const lab =
        await Lab.findById(
          req.params.id
        );

      if (!lab) {

        return res.status(404).json({
          success: false,
          message: "Lab not found",
        });

      }

      // MOVE PCS

      await PC.updateMany(

        {
          lab: lab.name,
        },

        {
          $set: {
            lab: "Unassigned",
          },
        }

      );

      // DELETE LAB

      await Lab.findByIdAndDelete(
        req.params.id
      );

      res.json({

        success: true,

        message:
          "Lab deleted and PCs moved to Unassigned",

      });

    }

    catch (error) {

      console.log(error);

      res.status(500).json({

        success: false,

        message:
          error.message,

      });

    }

  }
);


app.post(
  "/api/request-screenshot",
  (req, res) => {

    const { pcName } =
      req.body;

    io.emit(
      "take-screenshot",
      pcName
    );

    res.json({
      success: true
    });

  }
);

app.get(
  "/api/screenshot/:pcName",
  (req, res) => {

    const screenshot =
      screenshots[
        req.params.pcName
      ];

    res.json({

      success: true,

      screenshot:
        screenshot || ""

    });

  }
);


// ==========================
// ROOT ROUTE
// ==========================

app.get("/", (req, res) => {

  res.send(
    "Smart Lab Monitoring Backend Running"
  );

});



// ==========================
// PORT
// ==========================

const PORT =
  process.env.PORT || 5000;

server.listen(PORT, () => {

  console.log(
    ` Server Running On Port ${PORT}`
  );

});

