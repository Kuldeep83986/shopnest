const express = require("express");
const protect = require("../middleware/authmiddleware");
const admin = require("../middleware/adminmiddleware");
const { getAdminStats } = require("../controller/analyticsController");
const router = express.Router();

router.get("/", protect, admin, getAdminStats);

module.exports = router;