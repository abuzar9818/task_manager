const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
        });
        
        console.log(`MongoDB Connected: ${conn.connection.host}`);
        return conn;
    } catch (error) {
        console.error('Database connection error:', error);
        console.log("Make sure MongoDB is running on your system.");
        process.exit(1); // Exit if unable to connect to database
    }
};

module.exports = connectDB;