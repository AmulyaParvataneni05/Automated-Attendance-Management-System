import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Home.css";

const Home = () => {
  const [rollNo, setRollNo] = useState("");
  const [isError, setIsError] = useState(false);
  const [leaderboard, setLeaderboard] = useState([]);
  const [attendance, setAttendance] = useState(null);
  const navigate = useNavigate();

  const handleCheckClick = () => {
    if (rollNo.length !== 10) {
      setIsError(true);
    } else {
      setIsError(false);
      const randomPercentage = Math.floor(Math.random() * 100);
      setAttendance(randomPercentage);
    }
  };
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/attendance/analysis/CSE/A")
      .then((res) => {
        setLeaderboard(res.data.analysis || []);
      })
      .catch((err) => console.error("Error fetching leaderboard", err));
  }, []);
  useEffect(() => {
    const interval = setInterval(() => {
      setRollNo("");
      setAttendance(null);
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const handleLogin = (role) => {
    navigate(`/login`, { state: { role } });
  };

  return (
    <div className="home-container">
      <div className="rollno-box">
        <input
          type="text"
          maxLength="10"
          placeholder="Enter your Roll No"
          value={rollNo}
          onChange={(e) => setRollNo(e.target.value)}
          className={`rollno-input ${isError ? "error" : ""}`}
        />
        <button onClick={handleCheckClick} className="check-button">
          Check
        </button>
      </div>

      {isError && rollNo.length > 0 && (
        <p className="error-message">Enter correct hall ticket number</p>
      )}

      {attendance !== null && rollNo.length === 10 && (
        <p className="attendance-message">
          Attendance Percentage of {rollNo} is: {attendance}%
        </p>
      )}

      <h2 className="login-title">Login As</h2>
      <div className="login-buttons">
        <button className="login-btn admin-btn" onClick={() => handleLogin("Admin")}>
          Admin
        </button>
        <button className="login-btn faculty-btn" onClick={() => handleLogin("Faculty")}>
          Faculty
        </button>
      </div>

      <div className="leaderboard">
        <div className="leaderboard-header">Leader Board</div>
        <table className="leaderboard-table">
          <thead>
            <tr>
              <th>SNo</th>
              <th>Roll No</th>
              <th>Name</th>
              <th>Percentage</th>
            </tr>
          </thead>
          <tbody>
              {leaderboard.length > 0 ? (
                leaderboard.map((student, idx) => (
                  <tr key={student._id}>
                    <td>{idx + 1}</td>
                    <td>{student.rollNo}</td>
                    <td>{student.name}</td>
                    <td>{student.percentage || "N/A"}%</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4">No data available</td>
                </tr>
              )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Home;
