const express = require("express");
const cors = require("cors");
const path = require("path");

const usersRoutes = require("./routes/users");
const projectsRoutes = require("./routes/projects");

// Import your database connection instance 
// (Ensure the path matches where your db connection module or pool configur
const mysql = require('mysql2'); // or 'mysql' depending on what you installed

const db = mysql.createConnection({
    host: "localhost",
    user: "root",       // Your MySQL username
    password: "Harshitha@8088",       // Your MySQL password
    database: "ai_project_mentor" // Your actual database schema name
});

db.connect((err) => {
    if (err) console.log("Database connection error: ", err);
    else console.log("MySQL Database Connected!");
});

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// 1. Serve the parent 'client' directory so CSS, JS, and Image folders can still link fine
app.use(express.static(path.join(__dirname, "..")));

// 2. Also expose the 'html' directory directly at the root URL path
app.use(express.static(path.join(__dirname, "../html")));

// Default Root Route - Automatically shifts to your register view
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../html/register.html"));
});

/* ==========================================================================
   📊 LIVE DASHBOARD METRICS API ENDPOINT
   ========================================================================== */
app.get('/api/dashboard-stats', (req, res) => {
    const studentEmail = req.query.email;

    if (!studentEmail) {
        return res.status(400).json({ success: false, message: "Student Email context is required" });
    }

    // Target your projects table inside MySQL
    const queryStr = "SELECT * FROM projects WHERE studentEmail = ? ORDER BY id DESC";

    db.query(queryStr, [studentEmail], (err, results) => {
        if (err) {
            console.error("Database read optimization error:", err);
            return res.status(500).json({ success: false, message: "Database read error occurred." });
        }

        res.json({
            success: true,
            hasSubmissions: results.length > 0,
            latestStatus: results.length > 0 ? results[0].status : "Not Submitted",
            projects: results
        });
    });
});

// API Endpoints
app.use("/api/users", usersRoutes);
app.use("/api/projects", projectsRoutes);

// Catch-all Fallback
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found"
    });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});