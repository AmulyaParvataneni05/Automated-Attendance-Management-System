import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import { Navigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };
  const navigate = useNavigate();
  const location = useLocation();
  const {role} = location.state || {};
  // const handleLogin = () => {
  //   if (username && password) {
  //     if (role === "Admin") {
  //       navigate("/admin");
  //     } else if (role === "Faculty") {
  //       navigate("/faculty");
  //     } else {
  //       setErrorMessage("Role is undefined or not recognized.");
  //     }
  //   } else {
  //     setErrorMessage("Please fill in both fields.");
  //   }
  // };
const handleLogin = async () => {
  try {
    if (!username || !password) {
      setErrorMessage("Please fill in both fields.");
      return;
    }

    let url = "";
    let body = {};

    // 🔹 Decide API based on role
    if (role === "Admin") {
      url = "http://localhost:5000/api/auth/login";
      body = {
        email: username,
        password: password,
      };
    } else if (role === "Faculty") {
      url = "http://localhost:5000/api/students/login";
      body = {
        rollNo: username,
        password: password,
      };
    } else {
      setErrorMessage("Invalid role selected");
      return;
    }

    // 🔹 API call
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (!res.ok) {
      setErrorMessage(data.message || "Login failed");
      return;
    }

    // 🔥 STORE TOKEN
    localStorage.setItem("token", data.token);

    // Optional: store user info
    localStorage.setItem("user", JSON.stringify(data));

    // 🔹 Navigate based on role
    if (role === "Admin") {
      navigate("/admin");
    } else if (role === "Faculty") {
      navigate("/faculty");
    }

  } catch (error) {
    console.error(error);
    setErrorMessage("Something went wrong");
  }
};
  return (
    <div className="login-container">
      <div className="login-form">
        <h2>{role} Login</h2>
         {errorMessage && <p className="error-message">{errorMessage}</p>}
        <div className="input-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="input-group password-group">
          <label htmlFor="password">Password</label>
          <input
            type={passwordVisible ? "text" : "password"}
            id="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <span className="eye-icon" onClick={togglePasswordVisibility}>
            {passwordVisible ? <FaEye /> : <FaEyeSlash />}
          </span>
        </div>
        <button className="login-btn" onClick={handleLogin}>Login</button>
      </div>
    </div>
  );
}

export default Login;
