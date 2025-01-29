"use strict";

import express from "express";
import { Resource } from "../models/model.js";

const router = express.Router();

/**
 * Middleware to check if the user is authenticated
 * Proceeds to the next middleware/route if the user is authenticated,
 * otherwise sends a 401 Unauthorized response.
 */
export const isAuthenticated = (req, res, next) => {
    if (req.session.user) {
        return next();
    }
    res.status(401).send('Unauthorized');
};

/**
 * Middleware to check if the user has admin rights
 * Proceeds to the next middleware/route if the user is an admin,
 * otherwise sends a 403 Forbidden response.
 */
export const isAdmin = (req, res, next) => {
    if (!req.session.user || req.session.user.role !== "admin") {
        return res.status(403).json({ error: "Forbidden: You do not have admin rights." });
    }
    next();
};

/**
 * Admin dashboard route
 * Renders the dashboard view with the list of resources for authenticated admin users.
 */
router.get('/admin', isAuthenticated, isAdmin, async (req, res) => {
    try {
        const resources = await Resource.findAll();
        res.render('dashboard', { user: req.session.user, resources });
    } catch (error) {
        console.error("Error fetching resources for admin:", error);
        if (!res.headersSent) {
            res.status(500).send("Internal server error");
        }
    }
});

/**
 * Fetch all resources
 * Returns a JSON array of resources, optionally filtered by a query parameter.
 */
router.get("/api/resources", async (req, res) => {
    try {
        const query = req.query.query;
        let resources;

        if (query) {
            resources = await Resource.findAll({
                where: {
                    [Sequelize.Op.or]: [
                        { title: { [Sequelize.Op.like]: `%${query}%` } },
                        { description: { [Sequelize.Op.like]: `%${query}%` } },
                        { category: { [Sequelize.Op.like]: `%${query}%` } }
                    ]
                }
            });
        } else {
            resources = await Resource.findAll();
        }

        res.json(resources || []);
    } catch (err) {
        console.error("Error fetching resources:", err);
        res.status(500).json({ error: "Failed to fetch resources" });
    }
});


/**
 * Add a new resource (Admin only)
 * Allows authenticated admin users to add a new resource and redirects to the admin dashboard.
 */
router.post("/api/resources", isAuthenticated, isAdmin, async (req, res) => {
    const { title, category, link, description } = req.body;

    try {
        await Resource.create({ title, category, link, description });

    
        res.redirect("/admin");
    } catch (error) {
        console.error('Error adding resource:', error);

        if (!res.headersSent) {
            res.status(500).send('Internal server error');
        }
    }
});

/**
 * Delete a resource (Admin only)
 * Allows authenticated admin users to delete a resource by ID and redirects to the admin dashboard.
 */
router.delete("/api/resources/:id", isAuthenticated, isAdmin, async (req, res) => {
    const { id } = req.params;
    console.log(`Attempting to delete resource with ID: ${id}`);
    try {
        await Resource.destroy({ where: { id } });
        console.log(`Resource with ID: ${id} deleted successfully`);
        res.redirect('/admin');
    } catch (err) {
        console.error("Error deleting resource:", err);
        res.status(500).json({ error: "Failed to delete resource" });
    }
});

export default router;
