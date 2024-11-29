import React, { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import {
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
  Box,
  Link,
} from "@mui/material";
import { useNavigate } from "react-router-dom"; // For redirection
import "../../styles.css";

const Login = () => {
  const { login } = useContext(AuthContext);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState(""); // State to capture login errors
  const navigate = useNavigate(); // Hook for redirection

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Reset error message before login attempt
    try {
      await login(formData); // Attempt to login with form data
      navigate("/dashboard"); // Redirect to dashboard after successful login
    } catch (err) {
      console.error("Login failed:", err);
      setError("Login failed. Please check your credentials.");
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
      sx={{ backgroundColor: "#f4f4f4" }}
    >
      <Card sx={{ width: 400, padding: 3 }}>
        <CardContent>
          <Typography variant="h5" align="center" gutterBottom>
            Login
          </Typography>

          {/* Display error message if login fails */}
          {error && (
            <Typography
              color="error"
              variant="body2"
              align="center"
              gutterBottom
            >
              {error}
            </Typography>
          )}

          <form onSubmit={handleSubmit}>
            {/* Email Field */}
            <TextField
              fullWidth
              label="Email"
              variant="outlined"
              margin="normal"
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
            />

            {/* Password Field */}
            <TextField
              fullWidth
              label="Password"
              variant="outlined"
              margin="normal"
              type="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              required
            />

            {/* Submit Button */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              sx={{ marginTop: 2 }}
            >
              Login
            </Button>
          </form>

          {/* Link to Registration Page */}
          <Box mt={2} textAlign="center">
            <Typography variant="body2">
              Don't have an account?{" "}
              <Link
                href="/register" // Link to registration page
                sx={{ color: "primary.main", cursor: "pointer" }}
              >
                Register
              </Link>
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Login;
