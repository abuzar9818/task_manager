const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

// REGISTER
router.post("/register", async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Validation
        if (!username || !email || !password) {
            return res.status(400).json({ 
                message: "Username, email, and password are required" 
            });
        }

        if (password.length < 6) {
            return res.status(400).json({ 
                message: "Password must be at least 6 characters long" 
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ 
            $or: [{ email }, { username }] 
        });

        if (existingUser) {
            return res.status(400).json({ 
                message: "User with this email or username already exists" 
            });
        }

        const hashed = await bcrypt.hash(password, 10);

        const user = new User({ username, email, password: hashed });
        await user.save();

        res.status(201).json({ 
            message: "User registered successfully",
            userId: user._id
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: "Registration failed", error: error.message });
    }
});

// LOGIN
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validation
        if (!email || !password) {
            return res.status(400).json({ 
                message: "Email and password are required" 
            });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const valid = await bcrypt.compare(password, user.password);
        if (!valid) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: '7d' // Token expires in 7 days
        });

        res.json({ 
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: "Login failed", error: error.message });
    }
});

module.exports = router;
