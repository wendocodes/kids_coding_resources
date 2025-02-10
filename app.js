import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import http from "http";
import { sequelize, User, Resource } from "./models/model.js";
import authRoutes from "./routes/auth.js";
import resourcesRoutes from "./routes/resources.js";
import session from "express-session";
import methodOverride from 'method-override';
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
    cookie: { secure: false, maxAge: 9600000000000 }
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
sequelize.sync()
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

         // Bulk create resources
         await Resource.bulkCreate([
            {
                title: "Typing Club",
                category: "Beginner",
                link: "https://www.typingclub.com/",
                description: "Learning how to type is quite fundamental for coding, and typingclub.com is a great place to start learning how to type. It is web based and free for both individuals and schools. Learners earn stars and badges as they progress through the lessons. The lessons are interactive and fun. The site also offers a typing test to measure your typing speed and accuracy."
            },
            {
                title: "Scratch Jr.",
                category: "Bebinner",
                link: "https://www.scratchjr.org/",
                description: "ScratchJr allows young kids (ages 5 to 7) to create their own interactive stories and games through simple programming. As they explore, they develop problem-solving skills, work on creative projects, and learn to express their ideas using technology."
            },
            {
                title: "Scratch",
                category: "Beginner",
                link: "https://scratch.mit.edu/",
                description: "Scratch is both a programming language and an online platform where kids can create and share interactive content like stories, games, and animations with a global audience. Through Scratch, children develop creative thinking, teamwork, and logical reasoning skills. It is mainly intended for ages 8 to 16."
            },
            {
                title: "Otto's Farm",
                category: "Intermediate",
                link: "http://www.ottodiy.club/login.aspx",
                description: "Help Otto the robot manage tasks on the farm in this engaging educational game designed for beginners to learn algorithms using block-based or text-based coding. The game is free to play and is suitable for kids aged 6 and above. Teachers can obtain special accounts to create virtual classrooms and manage student profiles for teaching STEAM concepts."
            },
            {
                title: "BlockyGames",
                category: "Beginner",
                link: "https://blockly.games/?lang=en",
                description: "Blockly Games is a series of educational games designed for children with no prior experience with programming. By the end of these games, players are ready to use conventional text-based languages."
            },
        ]).then(data => {
            console.log("Resources created:", data);
        }).catch(err => {
            console.error("Failed to create resources:", err);
        });
    })
    .catch(err => {
        console.error("Database sync failed:", err);
    });

// Start the server
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});