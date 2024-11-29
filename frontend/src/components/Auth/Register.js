import React, { useState } from "react";
import {
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { useNavigate } from "react-router-dom"; // Hook for redirection
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import api from "../../api";
import "../../styles.css"

// Yup validation schema
const validationSchema = Yup.object({
  name: Yup.string()
    .min(4, "Name must be at least 4 characters")
    .required("Name is required"),

  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),

  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .matches(/[a-z]/, "Password must contain at least one lowercase letter")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/[0-9]/, "Password must contain at least one number")
    .matches(
      /[@$!%*?&]/,
      "Password must contain at least one special character"
    )
    .required("Password is required"),
});

const Register = () => {
  const [openDialog, setOpenDialog] = useState(false); // State to control Dialog visibility
  const [error, setError] = useState(""); // State to capture error messages
  const navigate = useNavigate(); // Hook for redirection

  // Handle form submission
  const handleSubmit = async (values) => {
    try {
      // Send registration request to the backend
      await api.post("/auth/register", values);

      // After successful registration, show the success dialog
      setOpenDialog(true);
    } catch (err) {
      console.error("Registration failed:", err);
      setError("Registration failed. Please try again."); // Set error message if registration fails
    }
  };

  // Close dialog and redirect to login page
  const handleDialogClose = () => {
    setOpenDialog(false); // Close the dialog
    navigate("/login"); // Redirect to login page
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
            Register
          </Typography>

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

          <Formik
            initialValues={{ name: "", email: "", password: "" }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ values, handleChange, handleBlur, touched, errors }) => (
              <Form>
                {/* Name Field */}
                <Field
                  fullWidth
                  name="name"
                  label="Name"
                  as={TextField}
                  variant="outlined"
                  margin="normal"
                  error={touched.name && Boolean(errors.name)}
                  helperText={touched.name && errors.name}
                />

                {/* Email Field */}
                <Field
                  fullWidth
                  name="email"
                  label="Email"
                  as={TextField}
                  variant="outlined"
                  margin="normal"
                  error={touched.email && Boolean(errors.email)}
                  helperText={touched.email && errors.email}
                />

                {/* Password Field */}
                <Field
                  fullWidth
                  name="password"
                  label="Password"
                  as={TextField}
                  variant="outlined"
                  type="password"
                  margin="normal"
                  error={touched.password && Boolean(errors.password)}
                  helperText={touched.password && errors.password}
                />

                {/* Submit Button */}
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  sx={{ marginTop: 2 }}
                >
                  Register
                </Button>
              </Form>
            )}
          </Formik>
        </CardContent>
      </Card>

      {/* Dialog (Popup) for Successful Registration */}
      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>Registration Successful</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            You have successfully registered. Please log in to continue.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Go to Login
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Register;
