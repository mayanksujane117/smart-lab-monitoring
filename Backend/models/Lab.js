const mongoose =
require("mongoose");

const labSchema =
new mongoose.Schema({

  name: {

    type: String,

    required: true,

  },

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

  createdAt: {

    type:
      Date,

    default:
      Date.now,

  },

});

labSchema.index(

  {

    organizationId: 1,

    name: 1,

  },

  {

    unique: true,

  }

);

module.exports =
mongoose.model(
  "Lab",
  labSchema
);