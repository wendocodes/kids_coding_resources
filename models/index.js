import { sequelize, Resource } from "../models/resource.js"; // Correct import for named exports

// Sync the database and log output
const initializeDatabase = async () => {
    try {
        await sequelize.sync({ force: false }); // Set force to true if you want to drop and recreate tables
        console.log("Database synced successfully.");
    } catch (error) {
        console.error("Error syncing database:", error);
    }
};

export { sequelize, Resource, initializeDatabase };
