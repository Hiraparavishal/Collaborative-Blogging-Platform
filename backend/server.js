const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const socketIo = require("socket.io");
const http = require("http");
const authRoutes = require("./routes/auth");
const blogRoutes = require("./routes/blogs");
const userRoutes = require("./routes/users");
const authenticateToken = require("./middleware/auth");
const cors = require("cors");

// Load environment variables
dotenv.config();

const app = express();
const server = http.createServer(app);

// Socket.IO setup with CORS configuration
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000", // Frontend URL
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"], // Allow headers your frontend uses
    credentials: true, // If using cookies or authentication
  },
});

// Middleware
app.use(express.json());

// CORS configuration for Express API (already covered in socket.io CORS)
app.use(
  cors({
    origin: "http://localhost:3000", // Frontend URL
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"], // Allow headers your frontend uses
    credentials: true, // If using cookies or authentication
  })
);

// Socket.IO events
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // User joins a specific room (blogId)
  socket.on("joinRoom", (blogId) => {
    socket.join(blogId);
    console.log(`User joined room: ${blogId}`);
  });

  // Handle content editing and broadcast changes to other users in the room
  socket.on("editContent", async ({ blogId, content }) => {
    try {
      // Update the blog content in the database (optional)
      // const updatedBlog = await Blog.findByIdAndUpdate(blogId, { content }, { new: true });

      // Emit the updated content to users in the same room
      socket.to(blogId).emit("receiveContent", content);
    } catch (err) {
      console.error("Error updating content:", err);
      socket.emit("error", "Failed to update content.");
    }
  });

  // Handle user disconnection
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Routes
app.use("/auth", authRoutes);
app.use("/blogs", authenticateToken, blogRoutes);
app.use("/users", authenticateToken, userRoutes);

// Database connection
mongoose
  .connect(process.env.DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1); // Exit the process if MongoDB connection fails
  });

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
