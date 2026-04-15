const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  role: { type: String, enum: ["student", "faculty"], required: true },

  rollNo: { type: String, required: true },

  name: { type: String, required: true },

  year: { type: Number },      // only for students
  section: { type: Number },   // only for students

  imagePath: { type: String }

}, { timestamps: true });

module.exports = mongoose.model("Student", studentSchema);