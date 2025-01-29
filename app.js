import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import http from "http";
import { sequelize, User, Resource } from "./models/model.js";
import authRoutes from "./routes/auth.js";
import resourcesRoutes from "./routes/resources.js";
import session from "express-session";
import methodOverride from 'method-override';

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
    secret: 'session-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false, maxAge: 240000 }
}));

app.use(methodOverride('_method'));
app.use((req, res, next) => {
    console.log("Session data:", req.session);
    res.locals.user = req.session.user || null;
    next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public"))); 

// Routes
app.use(authRoutes); 
app.use(resourcesRoutes); 


/**
 * Sync the database schema and populate initial data
 * Force sync drops and recreates tables
 */
sequelize.sync({ force: true }).then(() => {
    User.bulkCreate([
        { username: "admin@abc.com", password: "admin123", role: "admin" },
        { username: "mark@abc.com", password: "test9876", role: "admin" }
    ]);

    Resource.bulkCreate([
        { title: "Learn JavaScript", category: "Beginner", link: "https://javascript.info", description: "A comprehensive guide to modern JavaScript." },
        { title: "FreeCodeCamp", category: "Intermediate", link: "https://freecodecamp.org", description: "Learn coding with hands-on projects." },
        { title: "Eloquent JavaScript", category: "Advanced", link: "https://eloquentjavascript.net", description: "A deep dive into JavaScript concepts." }
    ]);
});

// Start the server
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
