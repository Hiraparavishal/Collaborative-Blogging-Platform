const express = require("express");
const User = require("../models/user");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const users = await User.find().select("name _id"); // Only select 'name' and '_id'
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Update User Role (Admin Only)
router.patch("/:id", async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.role = req.body.role;
    await user.save();
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
