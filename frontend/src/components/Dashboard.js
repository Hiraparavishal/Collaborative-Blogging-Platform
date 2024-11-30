import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Box,
  TextField,
  InputAdornment,
  IconButton,
  Chip,
  Avatar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import api from "../api";
import blogimage from "../demo.jpeg";

const Dashboard = () => {
  const [blogs, setBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [authorFilter, setAuthorFilter] = useState("");
  const [tagFilter, setTagFilter] = useState("");
  const [selectedBlogId, setSelectedBlogId] = useState(null);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const navigate = useNavigate();
  const loggedInUser = localStorage.getItem("userId"); // Get the logged-in user's info
  const loggedInUserRole = localStorage.getItem("role");

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await api.get("/blogs");
        setBlogs(res.data);
        setFilteredBlogs(res.data);
      } catch (err) {
        console.error("Error fetching blogs:", err);
      }
    };
    fetchBlogs();
  }, []);

  const uniqueAuthors = [...new Set(blogs.map((blog) => blog.author?.name))];
  const uniqueTags = [
    ...new Set(
      blogs.flatMap((blog) => blog.tags.map((tag) => tag.toLowerCase()))
    ),
  ];

  const handleFilter = () => {
    const filtered = blogs.filter((blog) => {
      const matchesSearch = blog.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesAuthor = authorFilter
        ? blog.author?.name?.toLowerCase() === authorFilter.toLowerCase()
        : true;
      const matchesTag = tagFilter
        ? blog.tags.some((tag) => tag.toLowerCase() === tagFilter.toLowerCase())
        : true;
      return matchesSearch && matchesAuthor && matchesTag;
    });
    setFilteredBlogs(filtered);
  };

  useEffect(() => {
    handleFilter();
  }, [searchQuery, authorFilter, tagFilter]);

  const isUserAuthorized = (blog) => {
    // Check if the logged-in user is the author or a collaborator
    if (loggedInUserRole === "admin") return true
    return (
      blog.author?._id === loggedInUser ||
      blog.collaborators.some(
        (collaborator) => collaborator._id === loggedInUser
      )
    );
  };

  const handleEdit = (id) => {
    navigate(`/edit/${id}`);
  };

  const handleDeleteClick = (id) => {
    setSelectedBlogId(id);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/blogs/${selectedBlogId}`);
      setBlogs(blogs.filter((blog) => blog._id !== selectedBlogId));
      setFilteredBlogs(
        filteredBlogs.filter((blog) => blog._id !== selectedBlogId)
      );
      setDeleteDialogOpen(false);
    } catch (err) {
      console.error("Error deleting blog:", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleCreate = () => {
    navigate("/create");
  };

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#f8f9fa" }}>
      <AppBar position="static" color="primary">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Collaborative Blogging Platform
          </Typography>
          <Button
            color="inherit"
            startIcon={<AddIcon />}
            onClick={handleCreate}
          >
            Create Blog
          </Button>
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Box
        sx={{
          backgroundColor: "#007FFF",
          color: "white",
          padding: 4,
          textAlign: "center",
        }}
      >
        <Typography variant="h3" gutterBottom>
          Welcome to Collaborative Blogging Platform
        </Typography>
        <Typography variant="h6" gutterBottom>
          Discover, read, and create amazing blogs.
        </Typography>
      </Box>

      <Box sx={{ padding: 3 }}>
        <Box
          display="flex"
          justifyContent="center"
          gap={2}
          flexWrap="wrap"
          sx={{ marginBottom: 3 }}
        >
          <TextField
            label="Search Blogs"
            variant="outlined"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            fullWidth
            sx={{ maxWidth: "600px", backgroundColor: "white" }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <IconButton edge="start">
                    <SearchIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <div>
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel>Author</InputLabel>
              <Select
                value={authorFilter}
                onChange={(e) => setAuthorFilter(e.target.value)}
                label="Author"
              >
                <MenuItem value="">All Authors</MenuItem>
                {uniqueAuthors.map((author, index) => (
                  <MenuItem key={index} value={author}>
                    {author}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel>Tag</InputLabel>
              <Select
                value={tagFilter}
                onChange={(e) => setTagFilter(e.target.value)}
                label="Tag"
              >
                <MenuItem value="">All Tags</MenuItem>
                {uniqueTags.map((tag, index) => (
                  <MenuItem key={index} value={tag}>
                    {tag}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
        </Box>

        <Grid container spacing={4} justifyContent="center">
          {filteredBlogs.length === 0 ? (
            <Typography
              variant="h6"
              color="textSecondary"
              align="center"
              sx={{ width: "100%" }}
            >
              No blogs found.
            </Typography>
          ) : (
            filteredBlogs.map((blog) => (
              <Grid item xs={12} sm={6} md={4} key={blog._id}>
                <Card
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    boxShadow: 3,
                    position: "relative",
                    "&:hover": { boxShadow: 6 },
                  }}
                >
                  <CardMedia
                    component="img"
                    height="140"
                    image={blogimage}
                    alt={blog.title}
                  />
                  <CardContent sx={{ paddingBottom: "60px" }}>
                    <Typography variant="h5" gutterBottom>
                      {blog.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      paragraph
                      sx={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        display: "-webkit-box",
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: "vertical",
                      }}
                      dangerouslySetInnerHTML={{ __html: blog.content }}
                    />
                    <Box display="flex" alignItems="center" marginBottom={1}>
                      <Avatar sx={{ marginRight: 1 }}>
                        {blog.author?.name[0]?.toUpperCase() || "A"}
                      </Avatar>
                      <Typography variant="body2" color="textPrimary">
                        {blog.author?.name || "Unknown"}
                      </Typography>
                    </Box>
                    <Box>
                      {blog.tags.map((tag, index) => (
                        <Chip
                          key={index}
                          label={tag}
                          sx={{ marginRight: 1, marginBottom: 1 }}
                        />
                      ))}
                    </Box>
                  </CardContent>

                  <Box
                    sx={{
                      position: "absolute",
                      bottom: "8px",
                      right: "8px",
                      display: "flex",
                      gap: "8px",
                    }}
                  >
                    {isUserAuthorized(blog) && (
                      <>
                        <IconButton
                          color="primary"
                          onClick={() => handleEdit(blog._id)}
                          title="Edit Blog"
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          color="secondary"
                          onClick={() => handleDeleteClick(blog._id)}
                          title="Delete Blog"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </>
                    )}

                  </Box>
                </Card>
              </Grid>
            ))
          )}
        </Grid>
      </Box>

      <Dialog
        open={isDeleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete Blog</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this blog? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="secondary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Dashboard;
