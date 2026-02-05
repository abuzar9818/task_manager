require("dotenv").config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const app = express();

// Serve static files from the client directory
app.use(express.static(path.join(__dirname, '../client')));

// Middleware
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000', // Allow your frontend origin
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

// Serve the main HTML file for the frontend
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/index.html'));
});

// Basic API route for testing
app.get('/api', (req, res) => {
    res.json({ message: "Task Management API is running!" });
});

// Connect to MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
        });
        console.log("MongoDB Connected Successfully");
    } catch (err) {
        console.error("Database connection error:", err);
        console.log("Make sure MongoDB is running on your system.");
        process.exit(1); // Exit if unable to connect to database
    }
};

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 3000;

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
});

module.exports = app;