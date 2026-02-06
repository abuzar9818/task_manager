require("dotenv").config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db'); 
const app = express();

app.use(express.static(path.join(__dirname, '../client')));


app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000', 
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/index.html'));
});


app.get('/api', (req, res) => {
    res.json({ message: "Task Management API is running!" });
});




app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});


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