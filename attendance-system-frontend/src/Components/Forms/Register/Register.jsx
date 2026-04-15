// src/pages/Forms/Register.jsx
import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import "./Register.css";

const Register = () => {
  const location = useLocation();
  const role = location.state?.role || "student";
  const [formData, setFormData] = useState({
    rollOrFacultyNo: "",
    name: "",
    photo: null,
    year: "",
    section: "",
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  const data = new FormData();
  data.append("role", role);
  data.append("rollNo", formData.rollOrFacultyNo);
  data.append("name", formData.name);
  data.append("photo", formData.photo);

  if (role === "student") {
    data.append("year", formData.year);
    data.append("section", formData.section);
  }

  try {
    const token = localStorage.getItem("token");
    const res = await fetch("http://localhost:5000/api/students", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: data
    });

    const result = await res.json();
    console.log(result);
    alert("Registered successfully");

  } catch (err) {
    console.error(err);
  }
};

  return (
    <div className="register-container">
      <h2 className="register-title">
        {role === "student" ? "Student Registration" : "Faculty Registration"}
      </h2>

      <form className="register-form" onSubmit={handleSubmit}>
        {/* Roll No or Faculty No */}
        <div className="form-group">
          <label>{role === "student" ? "Roll Number" : "Faculty Number"}:</label>
          <input
            type="text"
            name="rollOrFacultyNo"
            value={formData.rollOrFacultyNo}
            onChange={handleChange}
            required
          />
        </div>

        {/* Name */}
        <div className="form-group">
          <label>{role === "student" ? "Student Name" : "Faculty Name"}:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        {/* Upload Photo */}
         {role === "student" && (
          <>
        <div className="form-group">
          <label>Upload Photo:</label>
          <input
            type="file"
            name="photo"
            accept="image/*"
            onChange={handleChange}
            required
          />
        </div>
        </>
        )}

        {/* Extra fields if Student */}
        {role === "student" && (
          <>
            <div className="form-group">
              <label>Year:</label>
              <select
                name="year"
                value={formData.year}
                onChange={handleChange}
                required
              >
                <option value="">Select Year</option>
                <option value="2">II</option>
                <option value="3">III</option>
                <option value="4">IV</option>
              </select>
            </div>

            <div className="form-group">
              <label>Section:</label>
              <select
                name="section"
                value={formData.section}
                onChange={handleChange}
                required
              >
                <option value="">Select Section</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
              </select>
            </div>
          </>
        )}

        {/* Submit Button */}
        <button type="submit" className="register-btn">
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;
