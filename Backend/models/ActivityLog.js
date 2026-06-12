const mongoose =
require("mongoose");

const activityLogSchema =
new mongoose.Schema({

  action: {
    type: String,
    required: true,
  },

  organizationName: {
    type: String,
    default: "",
  },

  performedBy: {
    type: String,
    default:
      "Super Admin",
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },

});

module.exports =
mongoose.model(
  "ActivityLog",
  activityLogSchema
);