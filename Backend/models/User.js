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
      "Admin",
      "Lab Assistant",
    ],
    default:
      "Lab Assistant",
  },

});

module.exports =
mongoose.model(
  "User",
  userSchema
);