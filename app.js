import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import http from "http";
import { sequelize, User, Resource } from "./models/model.js";
import authRoutes from "./routes/auth.js";
import resourcesRoutes from "./routes/resources.js";
import session from "express-session";
import methodOverride from 'method-override';
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);

const PORT = 3000;

// Middleware
app.set("view engine", "ejs");
app.set('views', path.join(__dirname, 'public', 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: process.env.SESSION_SECRET || 'default-session-secret',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false, maxAge: 240000 }
}));

app.use(methodOverride('_method'));
app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware to handle caching issues
app.use((req, res, next) => {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.set('Expires', '0');
    res.set('Pragma', 'no-cache');
    next();
});

// Routes
app.use(authRoutes);
app.use(resourcesRoutes);

// Sync the database schema without force and create initial admin if needed
sequelize.sync({ force: true })
    .then(async () => {
        console.log("Database synced successfully with forced re-creation.");

        const adminUsername = process.env.ADMIN_USERNAME;
        const adminPassword = process.env.ADMIN_PASSWORD;

        if (adminPassword && adminUsername) {
            // Check if admin user already exists
            const adminExists = await User.findOne({ where: { username: adminUsername } });

            if (!adminExists) {
                // Create admin user with hashed password
                await User.create({
                    username: adminUsername,
                    password: adminPassword,
                    role: "admin"
                });
                console.log("Admin account created.");
            } else {
                console.log("Admin account already exists.");
            }
        } else {
            console.log("Admin username or password not provided.");
        }
    })
    .catch(err => {
        console.error("Database sync failed:", err);
    });

// Start the server
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});