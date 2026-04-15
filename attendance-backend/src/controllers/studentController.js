const Student = require("../models/Student");
const jwt = require("jsonwebtoken");
exports.addStudent = async (req, res) => {
  try {
    const { rollNo, name, year, section, role } = req.body;

    if (!req.file && role !== "faculty") {
      return res.status(400).json({ message: "Image is required" });
    }

    const student = await Student.create({
      role,
      rollNo,
      name,
      year: role === "student" ? year : undefined,
      section: role === "student" ? section : undefined,
      imagePath: role === "student" ? req.file.path : undefined,
    });

    res.status(201).json({
      message: `${role} registered successfully`,
      student
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.facultyLogin = async (req, res) => {
  try {
    const { rollNo, password } = req.body;
    const faculty = await Student.findOne({ rollNo, role: "faculty" });
    if (!faculty) {
      return res.status(404).json({ message: "Faculty not found" });
    }
    const expectedPassword = `${rollNo}@2026`;
    if (password !== expectedPassword) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
      const token = jwt.sign(
      {
        id: faculty._id,
        role: "faculty",
        rollNo: faculty.rollNo
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Faculty login successful",
      token,
      faculty
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getStudents = async (req, res) => {
  const students = await Student.find();
  res.json(students);
};