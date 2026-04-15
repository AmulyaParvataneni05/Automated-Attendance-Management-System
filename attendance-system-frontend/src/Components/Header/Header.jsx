import React from "react";
import "./Header.css";
import { Link } from "react-router-dom";
import logo from "../../assets/logo.png";

const Header = ({ subtitle }) => {
  return (
    <header className="header">
      <Link to="/" className="header-logo-link">
        <img src={logo} alt="Logo" className="header-logo" />
      </Link>
      <div className="header-container">
        <div className="header-text">
          <h1 className="header-title">Attendance Management System</h1>
          {subtitle && <p className="header-subtitle">{subtitle}</p>}
        </div>
      </div>
    </header>
  );
};

export default Header;