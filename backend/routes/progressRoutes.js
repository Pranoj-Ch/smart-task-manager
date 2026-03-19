const express = require("express");
const Task = require("../models/Task");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", auth, async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user });

    const total = tasks.length;
    const completed = tasks.filter(t => t.status === "Completed").length;

    const progress = total === 0 ? 0 : (completed / total) * 100;

    res.json({
      total,
      completed,
      progress: progress.toFixed(2) + "%",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;