// server.js

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const http = require("http");
const { Server } = require("socket.io");

const pcRoutes = require("./routes/pcRoutes");
const PC = require("./models/pcModel");

dotenv.config();

const app = express();
const server = http.createServer(app);

// Socket.io
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/pcs", pcRoutes);

// Test Route
app.get("/", (req, res) => {
  res.send("🚀 Smart Lab Monitoring Backend Running");
});

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected");
  })
  .catch((err) => {
    console.log("❌ MongoDB Connection Error");
    console.log(err);
  });


// ================= HEARTBEAT API =================

app.post("/api/heartbeat", async (req, res) => {

  try {

    const pcData = req.body;

    // Find Existing PC
    let pc = await PC.findOne({
      pcName: pcData.pcName,
    });

    if (pc) {

      // Update Existing PC
      pc.lab = pcData.lab;
      pc.ipAddress = pcData.ipAddress;
      pc.status = "Online";
      pc.lastSeen = new Date();

      await pc.save();

    } else {

      // Create New PC
      pc = await PC.create({
        pcName: pcData.pcName,
        lab: pcData.lab,
        ipAddress: pcData.ipAddress,
        status: "Online",
        lastSeen: new Date(),
      });
    }

    // Send Realtime Update
    io.emit("pc-update", pc);

    res.json({
      success: true,
      message: "Heartbeat Received",
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      error: error.message,
    });
  }
});


// ================= AUTO OFFLINE CHECK =================

setInterval(async () => {

  try {

    const pcs = await PC.find();

    const now = Date.now();

    for (const pc of pcs) {

      const lastSeen =
        new Date(pc.lastSeen).getTime();

      // If no heartbeat for 15 seconds
      if (now - lastSeen > 15000) {

        if (pc.status !== "Offline") {

          pc.status = "Offline";

          await pc.save();

          // Send Realtime Update
          io.emit("pc-update", pc);

          console.log(
            `🔴 ${pc.pcName} is Offline`
          );
        }
      }
    }

  } catch (error) {

    console.log(error);

  }

}, 5000);


// ================= SOCKET CONNECTION =================

io.on("connection", (socket) => {

  console.log("⚡ User Connected:", socket.id);

  socket.on("disconnect", () => {

    console.log("❌ User Disconnected:", socket.id);

  });
});


// ================= SERVER =================

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {

  console.log(
    `🚀 Server Running On Port ${PORT}`
  );

});