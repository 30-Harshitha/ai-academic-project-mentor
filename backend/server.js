const express = require("express");
const cors = require("cors");
const path = require("path");
const mysql = require('mysql2'); 

const app = express();

/* ==========================================================================
   ⚙️ MIDDLEWARE & INITIALIZATION
   ========================================================================== */
app.use(cors());
app.use(express.json());

// Serve static frontend assets
app.use(express.static(path.join(__dirname, "..")));
app.use(express.static(path.join(__dirname, "../html")));

// 🟢 ADDED: Serve the uploads folder publicly so the system can retrieve documents/images
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

/* ==========================================================================
   🗄️ DATABASE CONNECTION SETUP
   ========================================================================== */
// Appends Aiven SSL required flag if a cloud DATABASE_URL is present
const dbUrl = process.env.DATABASE_URL 
    ? (process.env.DATABASE_URL.includes("ssl-mode") ? process.env.DATABASE_URL : `${process.env.DATABASE_URL}?ssl-mode=REQUIRED`)
    : null;

const db = mysql.createConnection(dbUrl || {
    host: "localhost",
    user: "root",       
    password: "Harshitha@8088",       
    database: "ai_project_mentor" 
});

db.connect((err) => {
    if (err) {
        console.error("❌ Database connection error: ", err);
    } else {
        console.log("🚀 MySQL Database Connected successfully!");

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
                location VARCHAR(255),
                programmingLanguages VARCHAR(255),
                certifications VARCHAR(255),
                experience VARCHAR(255),
                skillsList TEXT,
                avatarUrl TEXT,
                assessmentScore INT,
                assessmentLevel VARCHAR(50),
                techSkills TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `;

        // SQL query string to build projects table if missing
        const createProjectsTable = `
            CREATE TABLE IF NOT EXISTS projects (
                id INT AUTO_INCREMENT PRIMARY KEY,
                studentName VARCHAR(255) DEFAULT 'Anonymous',
                studentEmail VARCHAR(255) NOT NULL,
                projectTitle VARCHAR(255) NOT NULL,
                projectDomain VARCHAR(255),
                projectCategory VARCHAR(255),
                teamSize INT DEFAULT 1,
                duration VARCHAR(100),
                difficulty VARCHAR(100),
                techStack TEXT,
                projectDescription TEXT,
                problemStatement TEXT,
                expectedOutcome TEXT,
                proposalFile VARCHAR(255),
                imagesCount INT DEFAULT 0,
                status VARCHAR(100) DEFAULT 'Submitted',
                submittedOn VARCHAR(100),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `;

        // Execute table initialization queries
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

// Export db instance BEFORE importing routes so routers can mount safely
module.exports = db;

/* ==========================================================================
   🛣️ ROUTING SYSTEM MAPPING
   ========================================================================== */
const usersRoutes = require("./routes/users");
const projectsRoutes = require("./routes/projects");

// Default Root Route
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

// Mount Sub-routers
app.use("/api/users", usersRoutes);
app.use("/api/projects", projectsRoutes);

// Catch-all Fallback for invalid paths
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found"
    });
});

/* ==========================================================================
   🌐 SERVER STARTUP
   ========================================================================== */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});