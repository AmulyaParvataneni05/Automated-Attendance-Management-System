import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./Components/Header/Header";
import Home from "./Components/Home/Home";
import Login from "./Components/Forms/Login/Login";
import Register from "./Components/Forms/Register/Register";
import Admin from "./Components/Admin/Admin";
import Faculty from "./Components/Faculty/Faculty";


const App = () => {
  return (
    <Router>
      <Header
        subtitle="Efficient | Secure | Smart"
      />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/faculty" element={<Faculty />} />
        <Route path="*" element={<h2 style={{ textAlign: "center" }}>404 - Page Not Found</h2>} />
      </Routes>
    </Router>
  );
};

export default App;
