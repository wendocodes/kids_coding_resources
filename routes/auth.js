import express from "express";
import { User, Resource } from "../models/resource.js";

const router = express.Router();

let userdata = null; // Global variable for logged-in user data

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
    res.json(userdata); // Send the logged-in user's data
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

        // Set the global userdata
        userdata = { id: user.id, username: user.username, role: user.role };

        res.redirect("/admin");
    } catch (error) {
        console.error("Error logging in:", error);
        res.status(500).send("Internal server error");
    }
});


// Admin route
router.get("/admin", async (req, res) => {
    if (!userdata || userdata.role !== "admin") {
        return res.redirect("/login");
    }

    try {
        const resources = await Resource.findAll();
        res.render("dashboard", { user: userdata, resources });
    } catch (error) {
        console.error("Error fetching resources for admin:", error);
        res.status(500).send("Internal server error");
    }
});


// Logout route
router.post("/api/logout", (req, res) => {
    userdata = null; // Clear the session data
    res.json({ message: "Logged out successfully" });
});

// Logout page route for redirection after logout
router.get("/logout", (req, res) => {
    userdata = null; // Clear the session data
    res.redirect("/"); // Redirect to homepage after logout
});

export default router;
