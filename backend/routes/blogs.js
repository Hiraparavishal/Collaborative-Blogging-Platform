const express = require("express");
const Blog = require("../models/blog");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

const router = express.Router();

// Create Blog
router.post("/", async (req, res) => {
  try {
    const { title, content, tags, collaborators } = req.body;
    const blog = new Blog({
      title,
      content,
      tags,
      author: req.user.id,
      collaborators,
    });

    await blog.save();
    res.status(201).json(blog);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate(
      "author collaborators",
      "name email"
    );
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    res.json(blog);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// Get All Blogs
router.get("/", async (req, res) => {
  try {
    const blogs = await Blog.find()
      .populate(
        "author", // Populate the 'author' field
        "name email" // Only retrieve 'name' and 'email' from the User (author) collection
      )
      .populate(
        "collaborators", // Populate the 'collaborators' field
        "name email" // Retrieve 'name' and 'email' for each collaborator
      );

    console.log(blogs);
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Update Blog
router.put("/:id", async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    if (
      blog.author.toString() !== req.user.id &&
      !blog.collaborators.includes(req.user.id)
    ) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    Object.assign(blog, req.body);
    await blog.save();
    res.json(blog);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete Blog
router.delete("/:id", async (req, res) => {
  try {
    // Extract the token from the Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No token provided" });
    }

    const token = authHeader.split(" ")[1];
    let decoded;

    // Decode the token
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET); // Use your secret key
    } catch (err) {
      return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }

    const userId = decoded.id; // Assuming your token includes the user ID
    const role = decoded.role; // Extract the role from the token payload


    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    // Authorization check
    if (
      role !== "admin" &&
      blog.author.toString() !== userId &&
      !blog.collaborators.some(
        (collaborator) => collaborator.toString() === userId
      )
    ) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // Delete the blog
    await Blog.deleteOne({ _id: req.params.id });
    res.json({ message: "Blog deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});




module.exports = router;
