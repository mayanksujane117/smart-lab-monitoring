const express = require("express");
const router = express.Router();

const Organization =
require("../models/Organization");

// CREATE ORGANIZATION

router.post("/", async (req, res) => {

  try {

    const {
      name,
      code,
    } = req.body;

    const exists =
      await Organization.findOne({
        code,
      });

    if (exists) {

      return res.status(400).json({
        success: false,
        message:
          "Organization already exists",
      });

    }

    const organization =
      await Organization.create({

        name,

        code,

      });

    res.json({

      success: true,

      organization,

    });

  }

  catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
    });

  }

});

// GET ALL ORGANIZATIONS

router.get("/", async (req, res) => {

  try {

    const organizations =
      await Organization.find();

    res.json(
      organizations
    );

  }

  catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
    });

  }

});

// DELETE ORGANIZATION

router.delete("/:id", async (req, res) => {

  try {

    await Organization.findByIdAndDelete(
      req.params.id
    );

    res.json({
      success: true,
    });

  }

  catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
    });

  }

});

module.exports =
router;