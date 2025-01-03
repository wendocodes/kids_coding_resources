import express from "express";
import { Resource } from "../models/resource.js";

const router = express.Router();

// Fetch all resources
router.get("/", async (req, res) => {
    try {
        const resources = await Resource.findAll();
        res.json(resources);
    } catch (error) {
        console.error("Error fetching resources:", error);
        res.status(500).json({ error: "Failed to fetch resources." });
    }
});

// Add a new resource
router.post("/", async (req, res) => {
    const { title, category, link } = req.body;

    if (!title || !category || !link) {
        console.error("Validation failed:", req.body);
        return res.status(400).json({ error: "All fields are required." });
    }

    try {
        const newResource = await Resource.create({ title, category, link });
        res.status(201).json(newResource);
    } catch (error) {
        console.error("Error creating resource:", error);
        res.status(500).json({ error: "Failed to add resource." });
    }
});

export default router;