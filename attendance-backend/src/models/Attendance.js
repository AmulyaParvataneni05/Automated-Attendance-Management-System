const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
  rollNo: String,
  name: String,
  year: String,
  section: String,
  status: String,
  date: String
});

module.exports = mongoose.model("Attendance", attendanceSchema);
// const mongoose = require("mongoose");

// const attendanceSchema = new mongoose.Schema({
//   student: { type: mongoose.Schema.Types.ObjectId, ref: "Student" },
//   date: { type: Date, default: Date.now },
//   status: { type: String, enum: ["present", "absent"] }
// });

// module.exports = mongoose.model("Attendance", attendanceSchema);
