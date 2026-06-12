const mongoose =
require("mongoose");

const pcSchema =
new mongoose.Schema({

  organizationId: {

    type:
      mongoose.Schema.Types.ObjectId,

    ref:
      "Organization",

    required:
      true,

    index:
      true,

  },

  pcName: {

    type:
      String,

    required:
      true,

  },

  lab: {

    type:
      String,

    default:
      "Unassigned",

  },

  ipAddress: {

    type:
      String,

    default:
      "",

  },

  status: {

    type:
      String,

    default:
      "Offline",

  },

  cpuUsage: {

    type:
      Number,

    default:
      0,

  },

  ramUsage: {

    type:
      Number,

    default:
      0,

  },

  internetSpeed: {

    type:
      Number,

    default:
      0,

  },

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

},
{
  timestamps: true,
}
);

// Same organization me
// same PC name duplicate na ho

pcSchema.index(

  {

    organizationId: 1,

    pcName: 1,

  },

  {

    unique: true,

  }

);

module.exports =
mongoose.model(
  "PC",
  pcSchema
);