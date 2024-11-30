const express = require("express");
const Task = require("../models/Task");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

router.get("/tasks", authMiddleware, async (req, res) => {
  const tasks = await Task.find({ user: req.user.id });
  console.log(req.user.id);
  console.log(tasks);
  res.json(tasks);
});

router.post("/tasks", authMiddleware, async (req, res) => {
  const { title, assignee, dueDate, priority, status } = req.body;

  try {
    console.log("Request Body:", req.body); // Log incoming data
    console.log("Authenticated User:", req.user); // Log user from auth middleware

    if (!title) {
      return res.status(400).json({ error: "Title is required." });
    }

    const task = new Task({
      title,
      assignee,
      dueDate,
      priority,
      status,
      user: req.user.id, // Ensure auth middleware is setting req.user
    });

    console.log("Task Created:", task); // Log created task

    await task.save();
    res.status(201).json(task);
  } catch (error) {
    console.error("Error saving task:", error); // Log errors
    res.status(500).json({ error: "Internal Server Error" });
  }
});


router.put("/tasks/:id", authMiddleware, async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: "Task update failed" });
  }
});

router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Task deletion failed" });
  }
});

module.exports = router;
