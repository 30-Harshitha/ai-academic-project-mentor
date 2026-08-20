// ==========================================
// server.js
// ==========================================

// 1. MUST BE AT THE VERY TOP OF THE FILE TO LOAD SECURE ENVIRONMENT VARIABLES
require('dotenv').config();

const express = require("express");
const cors = require("cors");
const path = require("path");

// 2. Import the shared database module cleanly from db.js
const db = require("./db"); 

const usersRoutes = require("./routes/users");
const projectsRoutes = require("./routes/projects");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve static web assets 
app.use(express.static(path.join(__dirname, "..")));
app.use(express.static(path.join(__dirname, "../html")));

// Default Root Route - Serves the registration form dashboard
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../html/register.html"));
});

// Explicit Page HTML Routes
app.get("/faculty", (req, res) => {
    res.sendFile(path.join(__dirname, "../html/faculty.html"));
});
app.get("/faculty.html", (req, res) => {
    res.sendFile(path.join(__dirname, "../html/faculty.html"));
});
app.get("/agent-hub", (req, res) => {
    res.sendFile(path.join(__dirname, "../html/agent-hub.html"));
});
app.get("/mentor", (req, res) => {
    res.sendFile(path.join(__dirname, "../html/ai-mentor.html"));
});
app.get("/reports", (req, res) => {
    res.sendFile(path.join(__dirname, "../html/report-view.html"));
});
app.get("/submit-idea", (req, res) => {
    res.sendFile(path.join(__dirname, "../html/submit-project.html"));
});
app.get("/assessment", (req, res) => {
    res.sendFile(path.join(__dirname, "../html/assessment.html"));
});

/* ==========================================================================
   📊 LIVE DASHBOARD METRICS API ENDPOINT
   ========================================================================== */
app.get('/api/dashboard-stats', (req, res) => {
    const studentEmail = req.query.email;

    if (!studentEmail) {
        return res.status(400).json({ success: false, message: "Student Email context is required" });
    }

    // Target your projects table inside MySQL using the shared db instance
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

// Start Server - Reads PORT from env file first, defaults to 5000
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});