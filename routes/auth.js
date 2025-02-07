import express from "express";
import { User, Resource } from "../models/model.js";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

// Render homepage with resources
router.get("/", async (req, res) => {
    try {
        const resources = await Resource.findAll();
        res.render("index", { resources });
    } catch (error) {
        console.error("Error fetching resources:", error);
        res.status(500).send("Internal server error");
    }
});

// Render login page
router.get("/login", (req, res) => {
    res.render("login", { errors: {}, username: "" });
});

// Handle user login
router.post('/api/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    try {
        // Find the user by username
        const user = await User.findOne({ where: { username } });

        if (!user) {
            return res.status(400).json({ message: "Invalid username or password" });
        }

        // Compare the password
        const match = await bcrypt.compare(password, user.password);

        if (!match) {
            return res.status(400).json({ message: "Invalid username or password" });
        }

        // Password matched, send back user data (excluding password)
        const userData = {
            id: user.id,
            username: user.username,
            role: user.role,
        };

        // Store user data in session
        req.session.user = userData;

        // Redirect to admin dashboard if user has admin privileges
        if (user.role === "admin") {
            req.session.save((err) => {
                if (err) {
                    console.error("Error saving session:", err);
                    return res.status(500).send("Internal server error");
                }
                res.redirect("/admin");
            });
        } else {
            // Render login page with error if user does not have admin privileges
            res.render("login", { errors: { login: "Insufficient privileges." }, username });
        }
    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ message: "Internal server error" });
    }
});

// Handle user logout
router.post("/api/logout", async (req, res) => {
    if (req.session) {
        req.session.destroy((err) => {
            if (err) {
                console.error("Error destroying session:", err);
                return res.status(500).json({ error: "Internal server error" });
            }
            res.clearCookie('connect.sid', { path: '/' });
            return res.redirect("/");  // Redirect after successful logout
        });
    } else {
        return res.status(400).json({ error: "No session to destroy" });
    }
});

export default router;