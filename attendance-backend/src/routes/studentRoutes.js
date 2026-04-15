const express = require("express");
const { addStudent, getStudents, facultyLogin } = require("../controllers/studentController");
const protect = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

// IMPORTANT: upload.single("photo") must match frontend field name
router.post("/", protect, upload.single("photo"), addStudent);

router.get("/", protect, getStudents);
router.post("/login",facultyLogin)

module.exports = router;