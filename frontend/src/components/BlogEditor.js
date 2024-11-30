import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Snackbar,
  Alert,
  AppBar,
  Toolbar,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Chip,
} from "@mui/material";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import io from "socket.io-client";
import api from "../api";

const BlogEditor = () => {
  const { id: blogId } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState({
    title: "",
    content: "",
    tags: "",
    collaborators: [],
  });
  const [users, setUsers] = useState([]); // To store all users fetched from the API
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const socket = io("http://localhost:5000");
    setSocket(socket);

    // Listen for content updates from other users
    socket.on("contentUpdated", (updatedBlog) => {
      if (updatedBlog._id === blogId) {
        setBlog((prevBlog) => ({ ...prevBlog, content: updatedBlog.content }));
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [blogId]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get("/users");
        setUsers(res.data); // Save the list of users
      } catch (err) {
        console.error("Error fetching users:", err);
        setError("Failed to fetch user data. Please try again.");
      }
    };

    fetchUsers();

    if (blogId) {
      setIsLoading(true);
      api
        .get(`/blogs/${blogId}`)
        .then((res) => {
          const { title, content, tags, collaborators } = res.data;
          setBlog({
            title,
            content,
            tags: tags.join(", "),
            collaborators: collaborators.map((collaborator) => ({
              _id: collaborator._id,
              name: collaborator.name,
            })),
          });
        })
        .catch((err) => {
          console.error("Error fetching blog:", err);
          setError("Failed to fetch blog data. Please try again.");
        })
        .finally(() => setIsLoading(false));
    }
  }, [blogId]);

  useEffect(() => {
    if (socket) {
      socket.emit("setUser", "userId"); // You can pass a real user ID here
    }
  }, [socket]);

  const handleChange = (key, value) => {
    setBlog((prev) => ({ ...prev, [key]: value }));

    if (key === "content" && socket) {
      socket.emit("updateContent", {
        blogId,
        content: value,
      });
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setError("");
    try {
      const blogData = {
        ...blog,
        tags: blog.tags.split(",").map((tag) => tag.trim()),
        collaborators: blog.collaborators.map((user) => user._id),
      };

      if (blogId) {
        await api.put(`/blogs/${blogId}`, blogData);
        setSnackbarMessage("Blog updated successfully!");
      } else {
        await api.post("/blogs", blogData);
        setSnackbarMessage("Blog created successfully!");
      }

      setOpenSnackbar(true);
      setTimeout(() => {
        navigate("/dashboard");
      }, 3000);
    } catch (err) {
      console.error("Error submitting blog:", err);
      setError("An error occurred while saving the blog. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#f4f6f8" }}>
      <AppBar position="static" color="primary">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Collaborative Blogging Platform
          </Typography>
          <Button color="inherit" onClick={() => navigate("/")}>
            Dashboard
          </Button>
        </Toolbar>
      </AppBar>

      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <Card sx={{ maxWidth: 600, width: "100%", padding: 3 }}>
          <CardContent>
            <Typography variant="h5" gutterBottom align="center">
              {blogId ? "Edit Blog" : "Create Blog"}
            </Typography>
            {isLoading ? (
              <Box display="flex" justifyContent="center" mt={3}>
                <CircularProgress />
              </Box>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSubmit();
                }}
              >
                <TextField
                  fullWidth
                  label="Title"
                  variant="outlined"
                  margin="normal"
                  value={blog.title}
                  onChange={(e) => handleChange("title", e.target.value)}
                  required
                />

                <Typography variant="body1" sx={{ marginTop: 2 }}>
                  Content
                </Typography>
                <ReactQuill
                  value={blog.content}
                  onChange={(value) => handleChange("content", value)}
                  style={{ height: "200px", marginBottom: "20px" }}
                />

                <TextField
                  fullWidth
                  label="Tags (comma-separated)"
                  variant="outlined"
                  margin="normal"
                  value={blog.tags}
                  onChange={(e) => handleChange("tags", e.target.value)}
                  required
                />

                {/* Collaborators Dropdown */}
                <Typography
                  variant="body1"
                  sx={{ marginTop: 2, marginBottom: 1 }}
                >
                  Collaborators
                </Typography>
                <FormControl fullWidth>
                  <Select
                    multiple
                    value={blog.collaborators}
                    onChange={(e) =>
                      handleChange("collaborators", e.target.value)
                    }
                    renderValue={(selected) => (
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                        {selected.map((collaborator) => (
                          <Chip
                            key={collaborator._id}
                            label={collaborator.name}
                          />
                        ))}
                      </Box>
                    )}
                    sx={{ backgroundColor: "white" }} // Ensures a clear background for the dropdown
                  >
                    {users.map((user) => (
                      <MenuItem key={user._id} value={user}>
                        {user.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  disabled={isLoading}
                  sx={{ marginTop: 3 }}
                >
                  {blogId ? "Update Blog" : "Create Blog"}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </Box>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert onClose={() => setOpenSnackbar(false)} severity="success">
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default BlogEditor;
