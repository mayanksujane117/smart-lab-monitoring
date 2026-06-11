const mongoose =
require("mongoose");

const organizationSchema =
new mongoose.Schema({

  name: {
    type: String,
    required: true,
    unique: true,
  },

  code: {
    type: String,
    required: true,
    unique: true,
  },

  status: {
    type: String,
    default: "Active",
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },

});

module.exports =
mongoose.model(
  "Organization",
  organizationSchema
);