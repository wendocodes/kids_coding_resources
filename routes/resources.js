'use strict';
import express from "express";
import { sequelize, Resource } from "../models/resource.js"; // Correct import for named exports

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
    const { title, category, link, description} = req.body;

    // Validation
    if (!title || !category || !link || !description) {
        return res.status(400).json({ error: "All fields except image are required." });
    }

    try {
        const newResource = await Resource.create({ title, category, link, description });
        res.status(201).json(newResource);
    } catch (error) {
        console.error("Error creating resource:", error);
        res.status(500).json({ error: "Failed to add resource." });
    }
});

// DELETE resource by ID
router.delete("/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const resource = await Resource.findByPk(id);

        if (!resource) {
            return res.status(404).json({ message: "Resource not found" });
        }

        await resource.destroy();
        res.status(200).json({ message: "Resource deleted successfully" });
    } catch (error) {
        console.error("Error deleting resource:", error);
        res.status(500).json({ message: "Failed to delete resource" });
    }
});

export default router;