const express = require("express");
const User = require("../Models/User");
const { StartupSecure } = require("../Middleware/StartupSecure");
const Startup = require("../Models/Startup");
const router = express.Router();

router.get("/getstatups", async (res, req) => {
  try {
    startups = await Startup.find();
    if (!startups) {
      return res.status(400).json({ error: "no statups here yet" });
    } else {
      req.json(startups);
    }
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
