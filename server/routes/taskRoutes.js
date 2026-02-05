const express = require("express");
const Task = require("../models/Task");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

// CREATE TASK (for logged-in user only)
router.post("/", auth, async (req, res) => {
    try {
        const { title, description, status, deadline } = req.body;

        // Validation
        if (!title || !deadline) {
            return res.status(400).json({ 
                message: "Title and deadline are required" 
            });
        }

        const task = new Task({
            title,
            description,
            status: status || "Pending", // Default to Pending if not provided
            deadline: new Date(deadline),
            userId: req.user.id
        });

        await task.save();
        res.status(201).json(task);
    } catch (error) {
        console.error('Error creating task:', error);
        res.status(500).json({ message: "Error creating task", error: error.message });
    }
});

// GET ONLY USER TASKS
router.get("/", auth, async (req, res) => {
    try {
        const tasks = await Task.find({ 
            userId: req.user.id 
        }).sort({ createdAt: -1 }); // Sort by newest first
        
        res.json(tasks);
    } catch (error) {
        console.error('Error fetching tasks:', error);
        res.status(500).json({ message: "Error fetching tasks", error: error.message });
    }
});

// UPDATE ONLY IF TASK BELONGS TO USER
router.put("/:id", auth, async (req, res) => {
    try {
        const { title, description, status, deadline } = req.body;

        const task = await Task.findOne({
            _id: req.params.id,
            userId: req.user.id
        });

        if (!task) {
            return res.status(403).json({ message: "Not allowed to update this task" });
        }

        // Update only provided fields
        if (title !== undefined) task.title = title;
        if (description !== undefined) task.description = description;
        if (status !== undefined) task.status = status;
        if (deadline !== undefined) task.deadline = new Date(deadline);

        await task.save();
        res.json(task);
    } catch (error) {
        console.error('Error updating task:', error);
        res.status(500).json({ message: "Error updating task", error: error.message });
    }
});

// DELETE ONLY IF TASK BELONGS TO USER
router.delete("/:id", auth, async (req, res) => {
    try {
        const task = await Task.findOne({
            _id: req.params.id,
            userId: req.user.id
        });

        if (!task) {
            return res.status(403).json({ message: "Not allowed to delete this task" });
        }

        await task.deleteOne();
        res.json({ message: "Task deleted successfully" });
    } catch (error) {
        console.error('Error deleting task:', error);
        res.status(500).json({ message: "Error deleting task", error: error.message });
    }
});

module.exports = router;
