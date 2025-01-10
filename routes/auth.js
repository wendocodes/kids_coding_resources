import express from "express";
import { User, Resource } from "../models/resource.js";


const router = express.Router();

let userdata = null;

// Serve the index.html page with resources for all users
router.get("/", async (req, res) => {
    try {
        const resources = await Resource.findAll();
        res.render("index", { resources });
    } catch (error) {
        console.error("Error fetching resources:", error);
        res.status(500).send("Internal server error");
    }
});

// API endpoint to fetch resources (for Vue.js)
router.get("/api/resources", async (req, res) => {
    try {
        const resources = await Resource.findAll();
        res.json(resources);
    } catch (error) {
        console.error("Error fetching resources:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Session route to check if the user is logged in
router.get("/api/auth/session", (req, res) => {
    if (!userdata) {
        return res.status(401).json({ error: "Not authenticated" });
    }
    res.json(userdata);
});

// Login route
router.get("/login", (req, res) => {
    res.render("login"); 
});

router.post("/login", async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ where: { username, password } });
        if (!user || user.role !== "admin") {
            return res.send("Invalid username, password, or insufficient privileges");
        }

        // Save user data in session
        req.session.user = { id: user.id, username: user.username, role: user.role };

        req.session.save((err) => {
            if (err) {
                console.error("Error saving session:", err);
                return res.status(500).send("Internal server error");
            }

            res.redirect("/admin");
        });
    } catch (error) {
        console.error("Error logging in:", error);
        res.status(500).send("Internal server error");
    }
});

router.post("/api/logout", (req, res) => {
    if (req.session) {
        req.session.destroy((err) => {
            if (err) {
                console.error("Error destroying session:", err);
                return res.status(500).json({ error: "Internal server error" });
            }
            res.json({ message: "Logged out successfully" });
        });
    } else {
        res.status(400).json({ error: "No session to destroy" });
    }
});

export default router;
