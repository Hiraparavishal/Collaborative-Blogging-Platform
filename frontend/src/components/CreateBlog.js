import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
  Snackbar,
  Alert,
  Autocomplete,
  AppBar,
  Toolbar,
} from "@mui/material";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import api from "../api";

const CreateBlog = () => {
  const navigate = useNavigate();

  const [blog, setBlog] = useState({
    title: "",
    content: "",
    tags: "",
    collaborators: [],
  });

  const [users, setUsers] = useState([]); // List of available collaborators
  const [isLoading, setIsLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Fetch users for collaborators dropdown
    const fetchUsers = async () => {
      try {
        const res = await api.get("/users");
        setUsers(res.data);
      } catch (err) {
        console.error("Error fetching users:", err);
        setError("Failed to fetch users. Please try again.");
      }
    };
    fetchUsers();
  }, []);

  const handleChange = (key, value) => {
    setBlog((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    if (!blog.title || !blog.content || !blog.tags) {
      setError("Please fill in all required fields.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const blogData = {
        ...blog,
        tags: blog.tags.split(",").map((tag) => tag.trim()), // Convert tags string to array
        collaborators: blog.collaborators.map((user) => user._id), // Send only user IDs
      };

      await api.post("/blogs", blogData);
      setSnackbarOpen(true); // Show success message

      // Redirect to Dashboard after 3 seconds
      setTimeout(() => navigate("/dashboard"), 3000);
    } catch (err) {
      console.error("Error creating blog:", err);
      setError("An error occurred while creating the blog. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token"); // Clear token or authentication state
    navigate("/login");
  };

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#f4f6f8" }}>
      {/* Navigation Bar */}
      <AppBar position="static" color="primary">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Collaborative Blogging Platform
          </Typography>
          <Button color="inherit" onClick={() => navigate("/dashboard")}>
            Dashboard
          </Button>
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="calc(100vh - 64px)" // Adjust height to exclude AppBar
      >
        <Card sx={{ maxWidth: 800, width: "100%", padding: 3 }}>
          <CardContent>
            <Typography variant="h5" gutterBottom align="center">
              Create a New Blog
            </Typography>
            {isLoading ? (
              <Typography align="center" variant="body1">
                Saving blog...
              </Typography>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSubmit();
                }}
              >
                {/* Title */}
                <TextField
                  fullWidth
                  label="Title"
                  variant="outlined"
                  margin="normal"
                  value={blog.title}
                  onChange={(e) => handleChange("title", e.target.value)}
                  required
                />

                {/* Content */}
                <Typography variant="body1" sx={{ marginTop: 2 }}>
                  Content
                </Typography>
                <ReactQuill
                  value={blog.content}
                  onChange={(value) => handleChange("content", value)}
                  style={{ height: "200px", marginBottom: "20px" }}
                />

                {/* Tags */}
                <TextField
                  fullWidth
                  label="Tags (comma-separated)"
                  variant="outlined"
                  margin="normal"
                  value={blog.tags}
                  onChange={(e) => handleChange("tags", e.target.value)}
                  required
                />

                {/* Collaborators Multi-Select */}
                <Autocomplete
                  multiple
                  options={users}
                  getOptionLabel={(user) => user.name || user.email}
                  value={users.filter((user) =>
                    blog.collaborators.some(
                      (collaborator) => collaborator._id === user._id
                    )
                  )}
                  onChange={(event, newValue) =>
                    handleChange(
                      "collaborators",
                      newValue.map((user) => ({
                        _id: user._id,
                        name: user.name,
                      }))
                    )
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="outlined"
                      label="Collaborators"
                      margin="normal"
                      placeholder="Select collaborators"
                    />
                  )}
                />

                {/* Error Message */}
                {error && (
                  <Typography
                    color="error"
                    variant="body2"
                    sx={{ marginTop: 2 }}
                  >
                    {error}
                  </Typography>
                )}

                {/* Submit Button */}
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  disabled={isLoading}
                  sx={{ marginTop: 3 }}
                >
                  Create Blog
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </Box>

      {/* Snackbar for Success Message */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert severity="success" onClose={() => setSnackbarOpen(false)}>
          Blog created successfully! Redirecting to dashboard...
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CreateBlog;
