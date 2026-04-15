const Attendance = require("../models/Attendance");
const { spawn } = require("child_process");
const path = require("path");
const axios = require("axios");

let pythonProcess = null;
const mongoose = require("mongoose");
const { buffer } = require("stream/consumers");

exports.markBulkAttendance = async (req, res) => {
  try {
    let { year, section, recognized } = req.body;
    console.log("Received recognized in API:", recognized);
    

    if (!year || !section) {
      return res.status(400).json({ message: "year and section required" });
    }

    // 🔥 Dynamic collection name
    const collectionName = `${year}_${section}`;

    // 🔥 Access dynamic collection
    const db = mongoose.connection.db;
    const studentsCollection = db.collection(collectionName);

    const students = await studentsCollection.find().toArray();

    if (!students.length) {
      return res.status(404).json({ message: "No students found" });
    }

    const today = new Date().toDateString();

    const attendanceData = [];
    const normalizedRecognized = recognized.map(r =>
  r.trim().toLowerCase()
);
    students.forEach((student) => {
  const status = normalizedRecognized.includes(
    student.rollno.trim().toLowerCase()
  )
    ? "present"
    : "absent";

  attendanceData.push({
    rollNo: student.rollno,
    name: student.name,
    year,
    section,
    status,
    date: today
  });
});

    // 🔥 Save all
    await Attendance.insertMany(attendanceData);

    res.json({
      message: "Attendance marked successfully",
      total: attendanceData.length,
      present: recognized.length,
      absent: attendanceData.length - recognized.length
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error marking attendance" });
  }
};

let recognizedStudents = [];
let sessionData = {};

exports.startAttendance = (req, res) => {
  let pythonOutputBuffer = "";
  const { lectureId, year, section } = req.body;
  sessionData = { lectureId, year, section, recognizedStudents: [], buffer:"" };

  if (pythonProcess) {
    return res.json({ message: "Attendance already running" });
  }

  const pythonDir = path.join(__dirname, "..", "..", "..", "python");
  const pythonExe = "C:\\Program Files\\Python310\\python.exe";

  pythonProcess = spawn(pythonExe, ["app.py",lectureId], {
    cwd: pythonDir,
  });

  pythonProcess.stdout.on("data", (data) => {
    console.log("DATA EVENT TRIGGERED");
  console.log(data.toString());
  });
  pythonProcess.stderr.on("data", (data) => {
    console.error("❌", data.toString());
  });

  pythonProcess.on("close", (code) => {
    // console.log(`Python exited: ${code}`);
    pythonProcess = null;
  });

  res.json({ message: "Attendance started" });
};

exports.stopAttendance = async (req, res) => {
  try {
    if (!pythonProcess) {
      return res.json({ message: "No active attendance session" });
    }

    pythonProcess.kill("SIGINT");

    pythonProcess.once("exit", async () => {

  setTimeout(async () => {   // 🔥 WAIT for stdout flush

    let recognizedStudents = [];
    const output = sessionData.buffer;

    // console.log("FULL OUTPUT:", output);

    if (output.includes("FINAL_OUTPUT:")) {
      try {
        const jsonPart = output
          .split("FINAL_OUTPUT:")[1]
          .trim()
          .split("\n")[0];

        recognizedStudents = JSON.parse(jsonPart);
      } catch (err) {
        console.error("❌ JSON parse error:", err);
      }
    }

    // console.log("✅ FINAL:", recognizedStudents);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/attendance/mark-bulk",
        {
          year: sessionData.year,
          section: sessionData.section,
          recognized: recognizedStudents,
        },
        {
          headers: {
            Authorization: req.headers.authorization,
          },
        }
      );

      res.json({
        message: "Attendance stopped and marked",
        result: response.data,
      });

    } catch (err) {
      console.error("Bulk API error:", err.message);
      res.status(500).json({ message: "Bulk attendance failed" });
    }

  }, 500); // 🔥 IMPORTANT DELAY

});

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error stopping attendance" });
  }
};

// exports.stopAttendance = (req, res) => {
//   if (pythonProcess) {
//     pythonProcess.kill("SIGINT"); // graceful stop
//     pythonProcess = null;
//     return res.json({ message: "Attendance stopped" });
//   }

//   res.json({ message: "No active attendance session" });
// };

exports.markAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.create(req.body);
    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: "Error saving attendance" });
  }
};

exports.getAttendance = async (req, res) => {
  try {
    const records = await Attendance.find().populate("student");
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: "Error fetching attendance" });
  }
};