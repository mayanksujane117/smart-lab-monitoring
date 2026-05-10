const express = require("express");

const router = express.Router();

const PC = require("../models/pcModel");

// GET ALL PCs
router.get("/", async (req, res) => {

  try {

    const pcs = await PC.find();

    res.json(pcs);

  } catch (error) {

    res.status(500).json({
      error: error.message,
    });
  }
});

module.exports = router;