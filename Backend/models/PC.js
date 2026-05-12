const mongoose = require("mongoose");

const pcSchema =
new mongoose.Schema({

  pcName: String,

  lab: String,

  ipAddress: String,

  status: String,

  // ==========================
  // SYSTEM STATS
  // ==========================

  cpuUsage: Number,

  ramUsage: Number,

  internetSpeed: Number,

  // ==========================
  // OPTIONAL
  // ==========================

  activeApp: {
    type: String,
    default: "Unknown",
  },

  screenshot: {
    type: String,
    default: "",
  },

  // ==========================
  // LAST SEEN
  // ==========================

  lastSeen: {

    type: Date,

    default: Date.now,

  },

});

module.exports =
mongoose.model(
  "PC",
  pcSchema
);