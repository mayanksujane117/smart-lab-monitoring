const mongoose =
require("mongoose");

const userSchema =
new mongoose.Schema({

  username: {
    type: String,
    required: true,
    unique: true,
  },

  password: {
    type: String,
    required: true,
  },

  role: {

    type: String,

    enum: [
      "Super Admin",
      "Admin",
      "Lab Assistant",
    ],

    default:
      "Lab Assistant",

  },

  organizationId: {

    type:
      mongoose.Schema.Types.ObjectId,

    ref:
      "Organization",

  },

  assignedLabs: {

    type: [String],

    default: [],

  },

});

module.exports =
mongoose.model(
  "User",
  userSchema
);