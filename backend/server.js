const express = require("express");
const cors = require("cors");
const path = require("path");
const mysql = require('mysql2'); 

const usersRoutes = require("./routes/users");
const projectsRoutes = require("./routes/projects");

// Database Connection Setup
// Uses cloud DATABASE_URL environment variable on Render, falls back to localhost for local work
const db = mysql.createConnection(process.env.DATABASE_URL || {
    host: "localhost",
    user: "root",       
    password: "Harshitha@8088",       
    database: "ai_project_mentor" 
});

db.connect((err) => {
    if (err) {
        console.log("Database connection error: ", err);
    } else {
        console.log("MySQL Database Connected successfully!");

        // SQL query string to build users table if missing
        const createUsersTable = `
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                fullName VARCHAR(255) NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                phoneNumber VARCHAR(50),
                dob DATE,
                collegeName VARCHAR(255),
                department VARCHAR(255),
                year VARCHAR(50),
                gender VARCHAR(50),
                githubUrl VARCHAR(255),
                linkedinUrl VARCHAR(255),
                password VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `;

        // SQL query string to build projects table if missing
        const createProjectsTable = `
            CREATE TABLE IF NOT EXISTS projects (
                id INT AUTO_INCREMENT PRIMARY KEY,
                studentEmail VARCHAR(255) NOT NULL,
                projectTitle VARCHAR(255) NOT NULL,
                description TEXT,
                githubUrl VARCHAR(255),
                status VARCHAR(50) DEFAULT 'Submitted',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `;

        // Execute table initialization
        db.query(createUsersTable, (err) => {
            if (err) console.error("Error verifying/creating users table:", err);
            else console.log("✅ Users table verified/ready.");
        });

        db.query(createProjectsTable, (err) => {
            if (err) console.error("Error verifying/creating projects table:", err);
            else console.log("✅ Projects table verified/ready.");
        });
    }
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
    console.log(`Server running on port ${PORT}`);
});