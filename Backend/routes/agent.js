const express = require("express");

const router = express.Router();

const Organization =
  require("../models/Organization");

const PC =
  require("../models/PC");

const Lab =
  require("../models/Lab");


// ========================================
// AGENT REGISTRATION
// ========================================

router.post(
  "/register",
  async (req, res) => {

    try {

      const {
        organizationCode,
        pcName,
        lab
      } = req.body;


      // ========================================
      // VALIDATION
      // ========================================

      if (
        !organizationCode ||
        !pcName ||
        !lab
      ) {

        return res.status(400).json({

          success: false,

          message:
            "Organization Code, PC Name and Lab are required"

        });

      }


      // ========================================
      // FIND ORGANIZATION
      // ========================================

      const organization =
        await Organization.findOne({

          code:
            organizationCode
              .trim()

        });


      if (!organization) {

        return res.status(404).json({

          success: false,

          message:
            "Invalid Organization Code"

        });

      }


      // ========================================
      // CHECK LAB
      // ========================================

      const labExists =
        await Lab.findOne({

          name:
            lab.trim(),

          organizationId:
            organization._id

        });


      const finalLab =
        labExists
          ? lab.trim()
          : "Unassigned";


      // ========================================
      // FIND EXISTING PC
      // ========================================

      const existingPC =
        await PC.findOne({

          organizationId:
            organization._id,

          pcName:
            pcName.trim()

        });


      // ========================================
      // CREATE PC
      // ========================================

      if (!existingPC) {

        await PC.create({

          organizationId:
            organization._id,

          pcName:
            pcName.trim(),

          lab:
            finalLab,

          status:
            "Offline",

          ipAddress:
            "",

          cpuUsage:
            0,

          ramUsage:
            0,

          internetSpeed:
            0,

          activeApp:
            "Unknown",

          screenshot:
            "",

          lastSeen:
            new Date()

        });

      }


      // ========================================
      // EXISTING PC
      // ========================================

      else {

        console.log(
          "Existing PC Found:",
          existingPC.pcName
        );

      }


      // ========================================
      // RESPONSE
      // ========================================

      return res.json({

        success: true,

        message:
          "Agent registered successfully",

        organizationId:
          organization._id,

        organizationName:
          organization.name,

        lab:
          existingPC
            ? existingPC.lab
            : finalLab

      });

    }

    catch (error) {

      console.log(
        "AGENT REGISTER ERROR:",
        error
      );

      return res.status(500).json({

        success: false,

        message:
          "Agent registration failed",

        error:
          error.message

      });

    }

  }
);


module.exports = router;