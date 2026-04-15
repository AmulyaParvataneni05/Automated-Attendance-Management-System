import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Admin.css";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";

const Admin = () => {
  const navigate = useNavigate();
  const [year, setYear] = useState("");
  const [section, setSection] = useState("");
  const [showAnalysis, setShowAnalysis] = useState(false); // Controls visibility of the analysis
  const pieData = [
    { name: "Present", value: 75 },
    { name: "Absent", value: 25 },
  ];

  const lineData = [
    { month: "Jan", attendance: 80 },
    { month: "Feb", attendance: 75 },
    { month: "Mar", attendance: 90 },
    { month: "Apr", attendance: 85 },
    { month: "May", attendance: 70 },
  ];

  const COLORS = ["#0088FE", "#FF8042"];

  const handleRegister = (role) => {
    navigate("/register", { state: { role } });
  };

  const getSections = () => {
    if (year === "IV") return ["1", "2", "3"];
    if (year === "II" || year === "III") return ["1", "2", "3", "4"];
    return [];
  };
  const handleGetAnalysis = () => {
    setShowAnalysis(true);
  };
  const handleLogout = () => {
    navigate("/");
  };

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1 className="admin-title">Welcome to Admin Dashboard</h1>
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </div>
      <div className="register">
        <h2 className="section-title">To Register</h2>
        <div className="register-buttons">
          <button className="register-btn" onClick={() => handleRegister("student")}>
            Student
          </button>
          <button className="register-btn" onClick={() => handleRegister("faculty")}>
            Faculty
          </button>
        </div>
      </div>

      <div className="analysis">
        <h2 className="section-title">Analysis</h2>
        <div className="dropdowns">
          <select value={year} onChange={(e) => setYear(e.target.value)}>
            <option value="">Year</option>
            <option value="II">II</option>
            <option value="III">III</option>
            <option value="IV">IV</option>
          </select>
          <select
            value={section}
            onChange={(e) => setSection(e.target.value)}
            disabled={!year}
          >
            <option value="">Section</option>
            {getSections().map((sec) => (
              <option key={sec} value={sec}>
                {sec}
              </option>
            ))}
          </select>
        </div>
        {year && section && (
          <button onClick={handleGetAnalysis} className="get-analysis-btn">
            Get Analysis
          </button>
        )}
        {showAnalysis && (
          <div className="charts">
            <PieChart width={300} height={300}>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
            <LineChart
              width={500}
              height={300}
              data={lineData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="attendance" stroke="#8884d8" activeDot={{ r: 8 }} />
            </LineChart>
          </div>
        )}
        <button className="close-btn-admin" onClick={() => setShowAnalysis(false)}>
          Close
        </button>
      </div>
    </div>
  );
};

export default Admin;
