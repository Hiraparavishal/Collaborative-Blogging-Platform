import React, { createContext, useState, useEffect } from "react";
import axios from "../api";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [userId, setUserId] = useState(localStorage.getItem("userId")); // State for userId

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
  }, [token]);

  const login = (credentials) =>
    axios.post("/auth/login", credentials).then((res) => {
      const { token, userId } = res.data; // Destructure token and userId
      localStorage.setItem("token", token);
      localStorage.setItem("userId", userId); // Store userId in localStorage
      setToken(token);
      setUserId(userId); // Update state with userId
    });

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId"); // Remove userId from localStorage
    setToken(null);
    setUserId(null); // Reset userId state
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, userId, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
