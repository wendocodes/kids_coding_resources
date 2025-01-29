import express from "express";
import { User, Resource } from "../models/model.js";

const router = express.Router();

let userdata = null;

/**
 * Serve the homepage (index.html) with all available resources
 * Fetches all resources from the database and renders the index page
 */
router.get("/", async (req, res) => {
    try {
        const resources = await Resource.findAll();
        res.render("index", { resources });
    } catch (error) {
        console.error("Error fetching resources:", error);
        res.status(500).send("Internal server error");
    }
});

/**
 * API endpoint to fetch all resources
 * Returns a JSON array of all resources in the database
 */
router.get("/api/resources", async (req, res) => {
    try {
        const resources = await Resource.findAll();
        res.json(resources);
    } catch (error) {
        console.error("Error fetching resources:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

/**
 * API endpoint to check user session
 * Returns the current user data if logged in, otherwise returns an error
 */
router.get("/api/auth/session", (req, res) => {
    if (!userdata) {
        return res.status(401).json({ error: "Not authenticated" });
    }
    res.json(userdata);
});

/**
 * Render the login page
 * Displays the login form to the user
 */
router.get("/login", (req, res) => {
    res.render("login", { errors: {}, username: "" });
});

/**
 * Handle login form submission
 * Validates the user's credentials and sets up the session if successful
 */
router.post("/login", async (req, res) => {
    const { username, password } = req.body;

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const errors = {};

    if (!emailPattern.test(username)) {
        errors.username = "Invalid email format.";
    }

    if (password.length < 6) {
        errors.password = "Password must be at least 6 characters long.";
    }

    if (Object.keys(errors).length > 0) {
        return res.render("login", { errors, username });
    }

    try {
        const user = await User.findOne({ where: { username, password } });

        if (!user || user.role !== "admin") {
            errors.login = "Invalid username, password, or insufficient privileges.";
            return res.render("login", { errors, username });
        }

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

/**
 * Handle logout
 * Destroys the session and redirects the user to the homepage
 */
router.post("/api/logout", async (req, res) => {
    if (req.session) {
        req.session.destroy(async (err) => {
            if (err) {
                console.error("Error destroying session:", err);
                return res.status(500).json({ error: "Internal server error" });
            }
            res.redirect("/");
        });
    } else {
        res.status(400).json({ error: "No session to destroy" });
    }
});

export default router;
