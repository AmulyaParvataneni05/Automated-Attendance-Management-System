import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Faculty.css";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const Faculty = () => {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const videoRef = useRef(null);
  // const [absentees] = useState([
  //   { roll: "21CS001", name: "John Doe" },
  //   { roll: "21CS005", name: "Jane Smith" },
  // ]);
  const [pieData, setPieData] = useState([
    { name: "Present", value: 0 },
    { name: "Absent", value: 0 },
  ]);
  const COLORS = ["#4caf50", "#f44336"];

  const facultyName = "FAC001";
  const profileImg = "https://static.vecteezy.com/system/resources/thumbnails/005/544/718/small_2x/profile-icon-design-free-vector.jpg";

  const handleLogout = () => {
    navigate("/");
  };

  const handleStartRecording = async () => {
    const token = localStorage.getItem("token");
  try {
    // 🔥 CALL BACKEND START API
    await fetch("http://localhost:5000/api/attendance/start", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
        lectureId: "Factulty1",
        year: selectedClass === "IV" ? 4 : selectedClass === "III" ? 3 : 2,
        section: selectedSection
      })
    });
    setIsRecording(true);

    console.log("✅ Attendance started");
  } catch (err) {
    console.error("❌ Start error:", err);
  }
};

  const handleStopRecording = async () => {
    const token = localStorage.getItem("token");
  try {
    // 🔥 STOP PYTHON + MARK ATTENDANCE
    const res =  await fetch("http://localhost:5000/api/attendance/stop", {
      method: "POST",
      headers: {
        "Authorization":  `Bearer ${token}`
      }
    });

    const data = await res.json();
    const present = data.result.present;
    const absent = data.result.absent;

    // ✅ Store data ONLY (don't open UI)
    setPieData([
      { name: "Present", value: present },
      { name: "Absent", value: absent },
    ]);

  } catch (err) {
    console.error("❌ Stop error:", err);
  }

  setIsRecording(false);
};

  // Automatically hide analysis after 2 minutes
  useEffect(() => {
    let timer;
    if (showAnalysis) {
      timer = setTimeout(() => {
        setShowAnalysis(false);
      }, 120000); // 2 minutes in milliseconds
    }
    return () => clearTimeout(timer); // Cleanup the timer if analysis is closed before 2 minutes
  }, [showAnalysis]);

  return (
    <div className="faculty-dashboard">
      <div className="faculty-header">
        <h2>Welcome !! {facultyName}.....</h2>
        <div className="profile">
          <img
            src={profileImg}
            alt="profile"
            onClick={() => setShowMenu(!showMenu)}
          />
          {showMenu && (
            <div className="profile-menu">
              <button onClick={handleLogout}>Logout</button>
            </div>
          )}
        </div>
      </div>
      <div className="faculty-actions">
        <button className="faculty-btn" onClick={() => setShowModal(true)}>
          Take Attendance
        </button>
        <button className="faculty-btn" onClick={() => setShowAnalysis(true)}>
          View Analysis
        </button>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Take Attendance</h3>
            <div className="form-group">
              <label>Select Class:</label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
              >
                <option value="">Choose Class</option>
                <option value="II">II</option>
                <option value="III">III</option>
                <option value="IV">IV</option>
              </select>
            </div>
            <div className="form-group">
              <label>Select Section:</label>
              <select
                value={selectedSection}
                onChange={(e) => setSelectedSection(e.target.value)}
              >
                <option value="">Choose Section</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
              </select>
            </div>
            <div className="video-container">
              {isRecording ? (
                <video ref={videoRef} autoPlay width="100%" height="auto" />
              ) : (
                <p>Camera not active</p>
              )}
            </div>
            <div className="button-container">
              {!isRecording ? (
                <button className="faculty-btn" onClick={handleStartRecording}>
                  Start Recording
                </button>
              ) : (
                <button className="faculty-btn" onClick={handleStopRecording}>
                  Stop Recording
                </button>
              )}
              <button className="close-btn" onClick={() => setShowModal(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {showAnalysis && (
        <div className="analysis-fac1">
          <div className="analysis-fac">
          {/* <div>
            <h3>Absentees List</h3>
            <table>
              <thead>
                <tr>
                  <th>Roll No</th>
                  <th>Name</th>
                </tr>
              </thead>
              <tbody>
                {absentees.map((a, index) => (
                  <tr key={index}>
                    <td>{a.roll}</td>
                    <td>{a.name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div> */}
          <div>
            <h3>Attendance Summary</h3>
            <PieChart width={300} height={250}>
              <Pie
                data={pieData}
                cx={150}
                cy={100}
                innerRadius={50}
                outerRadius={80}
                dataKey="value"
                label
              >
                {pieData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </div>
          </div>
        <button className="close-btn" onClick={() => setShowAnalysis(false)}>
          Close
        </button>
        </div>
      )}
    </div>
  );
};

export default Faculty;
