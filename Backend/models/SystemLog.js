const mongoose =
require("mongoose");

const systemLogSchema =
new mongoose.Schema({

  pcName: String,

  // ==========================
  // SYSTEM STATS
  // ==========================

  cpuUsage: Number,

  ramUsage: Number,

  internetSpeed: Number,

  // ==========================
  // STATUS
  // ==========================

  status: String,

  // ==========================
  // TIME
  // ==========================

  createdAt: {

    type: Date,

    default: Date.now,

  },

});

module.exports =
mongoose.model(

  "SystemLog",

  systemLogSchema

);