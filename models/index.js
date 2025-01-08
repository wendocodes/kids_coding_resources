"use strict";
import { sequelize } from "../models/resource.js";

// Sync the database and log output
const initializeDatabase = async () => {
    try {
        // await sequelize.sync({ force: true });
        await sequelize.sync({ alter: true });
        console.log("Database synced successfully.");
    } catch (error) {
        console.error("Error syncing database:", error);
    }
};

export { sequelize, initializeDatabase };
