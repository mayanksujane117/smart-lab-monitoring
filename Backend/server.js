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
const Notification = require("./models/Notification");
const auth = require("./middleware/auth");
const organizationRoutes = require("./routes/organizationRoutes");
const ActivityLog = require( "./models/ActivityLog" );
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

app.use(
  "/api/organizations",
  organizationRoutes
);

// ==========================
// NOTIFICATIONS
// ==========================

app.get(
  "/api/notifications/:role",
  async (req, res) => {

    try {

      const notifications =
        await Notification.find({

          role:
            req.params.role,

        })

        .sort({
          createdAt: -1,
        })

        .limit(50);

      res.json(
        notifications
      );

    }

    catch (error) {

      console.log(error);

      res.status(500).json({
        success: false,
      });

    }

  }
);

app.put(
  "/api/notifications/read/:id",
  async (req, res) => {

    try {

      await Notification.findByIdAndUpdate(

        req.params.id,

        {
          isRead: true,
        }

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

app.post(
  "/api/test-notification",
  async (req, res) => {

    await Notification.create({

      role:
        "Admin",

      message:
        "Lab A Offline",

    });

    res.json({
      success: true,
    });

  }
);

app.delete(
  "/api/notifications",
  async (req, res) => {

    try {

      await Notification.deleteMany({});

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
// LAB STATUS CHECK
// ==========================

if (

  finalLab !==
  "Unassigned"

) {

  const labPCs =
    await PC.find({

      lab: finalLab,

      organizationId,

    });

  const onlinePCs =
    labPCs.filter(

      (pc) =>

        pc.status ===
        "Online"

    );

  const offlinePCs =
    labPCs.filter(

      (pc) =>

        pc.status ===
        "Offline"

    );

  if (

    onlinePCs.length === 0 &&

    labPCs.length > 0

  ) {

    await Notification.create({

      role:
        "Admin",

      organizationId,

      message:

        `${finalLab} Lab Offline`,

    });

  }

  if (

    onlinePCs.length === 1 &&

    oldPC?.status ===
      "Offline" &&

    status ===
      "Online"

  ) {

    await Notification.create({

      role:
        "Admin",

      organizationId,

      message:

        `${finalLab} Lab Online`,

    });

  }

}

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
// AUTO EXPIRY CHECK
// ==========================

setInterval(

  async () => {

    try {

      await Organization.updateMany(

        {

          expiryDate: {

            $lt: new Date(),

          },

          status: "Active",

        },

        {

          status: "Expired",

        }

      );

    }

    catch (error) {

      console.log(error);

    }

  },

  1000 * 60 * 60

);

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

  organizationId,

} = req.body;

    if (!username || !password) {

      return res.status(400).json({
        success: false,
        message: "Username and Password required",
      });

    }

    if (!organizationId) {

  return res.status(400).json({

    success: false,

    message:
      "Organization required",

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

      
  organizationId,

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

  organizationId:
    user.organizationId,

  assignedLabs:
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

    role: user.role,

    organizationId:
      user.organizationId,

  },

  process.env.JWT_SECRET,

  {

    expiresIn: "7d",

  }

);

   res.json({

  success: true,

  token,

  user: {

    id: user._id,

    username: user.username,

    role: user.role,

    organizationId:
      user.organizationId,

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
// SUPER ADMIN ANALYTICS
// ==========================

const Organization =
require("./models/Organization");

app.get(
  "/api/super-admin/stats",
  async (req, res) => {

    try {

      const totalOrganizations =
        await Organization.countDocuments();

      const totalAdmins =
        await User.countDocuments({
          role: "Admin",
        });

      const totalLabs =
        await Lab.countDocuments();

      const totalPCs =
        await PC.countDocuments();

      res.json({

        totalOrganizations,

        totalAdmins,

        totalLabs,

        totalPCs,

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

app.get(
  "/api/super-admin/activity",
  async (req, res) => {

    try {

      const logs =
        await ActivityLog
          .find()
          .sort({
            createdAt: -1
          })
          .limit(10);

      res.json(logs);

    }

    catch (error) {

      console.log(error);

      res.status(500).json({

        success: false,

      });

    }

  }
);

app.get(
  "/api/super-admin/admins",
  async (req, res) => {

    try {

      const admins =
        await User.find({

          role: "Admin",

        }).populate(

          "organizationId",

          "name"

        );

      res.json(
        admins
      );

    }

    catch (error) {

      console.log(error);

      res.status(500).json({

        success: false,

      });

    }

  }
);

app.delete(
  "/api/super-admin/admin/:id",
  async (req, res) => {

    try {

      await User.findByIdAndDelete(
        req.params.id
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
// GET ALL ORGANIZATIONS
// ==========================

app.get(
  "/api/super-admin/organizations",
  async (req, res) => {

    try {

      const organizations =
        await Organization.find()
        .sort({
          createdAt: -1,
        });

      res.json(
        organizations
      );

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
// TOGGLE ORGANIZATION
// ==========================

app.put(
  "/api/super-admin/organization/:id/status",
  async (req, res) => {

    try {

      const org =
        await Organization.findById(
          req.params.id
        );

      if (!org) {

        return res.status(404).json({
          success: false,
        });

      }

      org.status =

        org.status === "Active"
          ? "Inactive"
          : "Active";

      await org.save();

      await ActivityLog.create({

 action:
  `Organization ${org.status}`,

organizationName:
  org.name,

});

      res.json({

        success: true,

        status:
          org.status,

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
// DELETE ORGANIZATION
// ==========================

app.delete(
  "/api/super-admin/organization/:id",
  async (req, res) => {

    try {

      const org =
        await Organization.findById(
          req.params.id
        );

      if (!org) {

        return res.status(404).json({
          success: false,
        });

      }

      await User.deleteMany({

        organizationId:
          org._id,

      });

      await Lab.deleteMany({

        organizationId:
          org._id,

      });

      await PC.deleteMany({

        organizationId:
          org._id,

      });

      await Organization.findByIdAndDelete(
        org._id
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
// RESET ADMIN PASSWORD
// ==========================

app.put(
  "/api/super-admin/reset-password",
  async (req, res) => {

    try {

      const {

        username,

        newPassword,

      } = req.body;

      const user =
        await User.findOne({

          username,

          role: "Admin",

        });

      if (!user) {

        return res.status(404).json({

          success: false,

          message:
            "Admin not found",

        });

      }

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
          "Password Reset Successfully",

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
  organizationId,
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

  name: lab,

  organizationId,

});

const finalLab =
labExists
  ? lab
  : "Unassigned";


  const oldPC =
await PC.findOne({

  pcName,

  organizationId,

});

    // UPDATE PC

    const updatedPC =
  await PC.findOneAndUpdate(

    {
      pcName,
      organizationId,
    },

    {
      organizationId,

      pcName,

      lab: finalLab,

      ipAddress,

      status,

      cpuUsage,

      ramUsage,

      internetSpeed,

      activeApp,

      screenshot,

      lastSeen: new Date(),

    },

    {

      new: true,

      upsert: true,

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

    // ==========================
// PC STATUS NOTIFICATION
// ==========================

if (

  oldPC &&

  oldPC.status !== status

) {

  await Notification.create({

    role:
      "Lab Assistant",

    organizationId,

    message:

      `${pcName} ${status}`,

  });

}

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

app.get(
  "/api/pcs/:organizationId",
  async (req, res) => {

    try {

      const pcs =
        await PC.find({

          organizationId:
            req.params.organizationId,

        })

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
// ORGANIZATION USER STATS
// ==========================

app.get(
  "/api/super-admin/user-stats/:organizationId",
  async (req, res) => {

    try {

      const organizationId =
        req.params.organizationId;

      const totalUsers =
        await User.countDocuments({

          organizationId,

        });

      const admins =
        await User.countDocuments({

          organizationId,

          role: "Admin",

        });

      const labAssistants =
        await User.countDocuments({

          organizationId,

          role: "Lab Assistant",

        });

      res.json({

        totalUsers,

        admins,

        labAssistants,

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
// CREATE ADMIN
// ==========================

app.post(
  "/api/super-admin/create-admin",
  async (req, res) => {

    try {

      const {

        adminName,

        username,

        password,

        organizationId,

      } = req.body;

      const existingUser =
        await User.findOne({

          username,

        });

      if (existingUser) {

        return res.status(400).json({

          success: false,

          message:
            "Username already exists",

        });

      }

      const hashedPassword =
        await bcrypt.hash(

          password,

          10

        );

      await User.create({

        username,

        password:
          hashedPassword,

        role:
          "Admin",

        organizationId,

      });

      await ActivityLog.create({

  action:
    "Admin Created",

  organizationName:
    adminName,

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
// GET USERS
// ==========================

app.get(
  "/api/users/:organizationId",
  async (req, res) => {

    try {

      const users =
        await User.find({

          organizationId:
            req.params.organizationId,

        })

        .select("-password");

      res.json(users);

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

    const {

  name,

  organizationId,

} = req.body;


    const exists =
await Lab.findOne({

  name,

  organizationId,

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

  organizationId,

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

app.get(
  "/api/labs/:organizationId",
  async (req, res) => {

    try {

      const labs =
        await Lab.find({

          organizationId:
            req.params.organizationId,

        })

        .sort({
          createdAt: -1,
        });

      res.json(labs);

    }

    catch (error) {

      console.log(error);

      res.status(500).json({

        success: false,

      });

    }

  }
);

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

    organizationId:
      lab.organizationId,

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

