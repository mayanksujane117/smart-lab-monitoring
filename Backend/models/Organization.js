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

  adminName: {
    type: String,
    default: "",
  },

  adminUsername: {
    type: String,
    default: "",
  },

  plan: {
    type: String,
    enum: [
      "Free",
      "Basic",
      "Premium",
    ],
    default: "Free",
  },

  status: {
    type: String,
    enum: [
      "Active",
      "Inactive",
    ],
    default: "Active",
  },

  expiryDate: {
    type: Date,
    default: null,
  },

  totalLabs: {
    type: Number,
    default: 0,
  },

  totalPCs: {
    type: Number,
    default: 0,
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