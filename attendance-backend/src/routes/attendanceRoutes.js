const express = require("express");
const {startAttendance,stopAttendance, markAttendance, getAttendance, markBulkAttendance } = require("../controllers/attendanceController");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/start", protect, startAttendance);
router.post("/stop", protect, stopAttendance);
router.post("/", protect, markAttendance);
router.get("/", protect, getAttendance);
router.post("/mark-bulk", protect, markBulkAttendance);

module.exports = router;
