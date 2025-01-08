"use strict";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import http from "http";
import { Server } from "socket.io";
import { initializeDatabase } from "./models/index.js";
import resourcesRoutes from "./routes/resources.js";

// Resolve __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, "public"))); 

// Routes
app.use("/api/resources", resourcesRoutes); 

io.on("connection", (socket) => {
    console.log("New client connected:", socket.id);

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
        await initializeDatabase();
        console.log("Database synced with schema updates.");

        server.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("Failed to start the server:", error);
    }
};

startServer();
