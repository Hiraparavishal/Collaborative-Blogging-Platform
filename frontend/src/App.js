import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AuthProvider from "./context/AuthContext";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import Dashboard from "./components/Dashboard";
import BlogEditor from "./components/BlogEditor";
import CreateBlog from "./components/CreateBlog";

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />{" "}
          <Route path="/edit/:id" element={<BlogEditor />} />
          <Route path="/create" element={<CreateBlog />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
