'use strict';
import { sequelize, Resource } from "../models/resource.js";

// Sync the database and log output
const initializeDatabase = async () => {
    try {
        await sequelize.sync({ force: false });
        console.log("Database synced successfully.");
    } catch (error) {
        console.error("Error syncing database:", error);
    }
};

export { sequelize, Resource, initializeDatabase };
