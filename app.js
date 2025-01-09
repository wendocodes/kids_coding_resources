import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import http from "http";
import { Server } from "socket.io";
import { sequelize, User, Resource } from "./models/resource.js";
import authRoutes from "./routes/auth.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = 3000;

// Middleware
app.set("view engine", "ejs");
app.set('views', path.join(__dirname, 'public', 'views')); 
app.set('view engine', 'ejs'); 

// Routes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(authRoutes);

// Sync the database and seed data
sequelize.sync({ force: true }).then(() => {
    User.bulkCreate([
        { username: "admin", password: "admin123", role: "admin" },
        { username: "mark", password: "9876", role: "admin" } 
    ]);

    Resource.bulkCreate([
        { title: "Learn JavaScript", category: "Beginner", link: "https://javascript.info", description: "A comprehensive guide to modern JavaScript." },
        { title: "FreeCodeCamp", category: "Intermediate", link: "https://freecodecamp.org", description: "Learn coding with hands-on projects." },
        { title: "Eloquent JavaScript", category: "Advanced", link: "https://eloquentjavascript.net", description: "A deep dive into JavaScript concepts." }
    ]);

    console.log("Database synced and seeded.");
});

// Start the server
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
