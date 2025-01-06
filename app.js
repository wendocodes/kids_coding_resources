'use strict';
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import http from "http";
import { Server } from "socket.io";
import { sequelize } from "./models/index.js";
import resourcesRoutes from "./routes/resources.js"; // Import routes

// Resolve __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = 3000;

// Middleware
app.use(express.json()); // For parsing JSON
app.use(express.static(path.join(__dirname, "public"))); // Serve static files

// Routes
app.use("/api/resources", resourcesRoutes); // Use the resources route

// Socket.IO setup
io.on("connection", (socket) => {
    console.log("New client connected:", socket.id);

    // Listen for new resource events and broadcast updates to all clients
    socket.on("new-resource", (data) => {
        console.log("Broadcasting new resource:", data);
        socket.broadcast.emit("update-resources", data);
    });

    socket.on("disconnect", () => {
        console.log("Client disconnected:", socket.id);
    });
});

// Start the server and initialize the database
const startServer = async () => {
    try {
        // Sync database with force option to add the description field
        await sequelize.sync({ force: true });
        console.log("Database synced with schema updates.");

        // Start the server
        server.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("Failed to start the server:", error);
    }
};

startServer();
