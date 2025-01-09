import express from "express";
import { Resource } from "../models/resource.js";

const router = express.Router();

// Middleware to check if the user is authenticated
const isAuthenticated = (req, res, next) => {
    if (!userdata) {
        return res.status(401).json({ error: "Unauthorized" });
    }
    next();
};

// Middleware to check if the user is an admin
const isAdmin = (req, res, next) => {
    if (!userdata || userdata.role !== "admin") {
        return res.status(403).json({ error: "Access denied" });
    }
    next();
};

// Fetch all resources
router.get("/api/resources", async (req, res) => {
    try {
        const resources = await Resource.findAll();
        res.json(resources || []); // Return empty array if no resources
    } catch (err) {
        console.error("Error fetching resources:", err);
        res.status(500).json({ error: "Failed to fetch resources" });
    }
});


// Add a new resource (Admin only)
router.post("/api/resources", isAuthenticated, isAdmin, async (req, res) => {
    const { title, category, link, description } = req.body;
    try {
        const newResource = await Resource.create({ title, category, link, description });
        res.status(201).json(newResource);
    } catch (err) {
        console.error("Error adding resource:", err);
        res.status(500).json({ error: "Failed to add resource" });
    }
});

// Delete a resource (Admin only)
router.delete("/api/resources/:id", isAuthenticated, isAdmin, async (req, res) => {
    const { id } = req.params;
    try {
        await Resource.destroy({ where: { id } });
        res.status(200).json({ message: "Resource deleted successfully" });
    } catch (err) {
        console.error("Error deleting resource:", err);
        res.status(500).json({ error: "Failed to delete resource" });
    }
});

export default router;
