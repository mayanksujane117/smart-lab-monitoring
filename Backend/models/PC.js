const mongoose =
require("mongoose");

const pcSchema =
new mongoose.Schema({

  organizationId: {

    type:
      mongoose.Schema.Types.ObjectId,

    ref:
      "Organization",

  },

  pcName:
    String,

  lab:
    String,

  ipAddress:
    String,

  status:
    String,

  cpuUsage:
    Number,

  ramUsage:
    Number,

  internetSpeed:
    Number,

  activeApp: {

    type:
      String,

    default:
      "Unknown",

  },

  screenshot: {

    type:
      String,

    default:
      "",

  },

  lastSeen: {

    type:
      Date,

    default:
      Date.now,

  },

});

module.exports =
mongoose.model(
  "PC",
  pcSchema
);