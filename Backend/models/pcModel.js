const mongoose = require("mongoose");

const pcSchema = new mongoose.Schema({

  pcName: {
    type: String,
    required: true,
  },

  lab: {
    type: String,
    required: true,
  },

  ipAddress: {
    type: String,
    required: true,
  },

  status: {
    type: String,
    default: "Online",
  },

  lastSeen: {
    type: Date,
    default: Date.now,
  },

});

module.exports = mongoose.model(
  "PC",
  pcSchema
);