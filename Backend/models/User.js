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
      "Lab In-charge",
    ],
    default:
      "Lab In-charge",
  },

});

module.exports =
mongoose.model(
  "User",
  userSchema
);