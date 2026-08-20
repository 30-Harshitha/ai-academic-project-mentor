// ==========================================
// routes/projects.js (Granular Multi-Agent Endpoints & Unified Pipeline)
// ==========================================

const express = require("express");
const router = express.Router();
const db = require("../db");
const multer = require("multer");
const path = require("path");

require('dotenv').config();

// Import the Multi-Agent Logic Engine
const agents = require("../services/aiAgents");

// Configure local storage rules
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/"); 
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + Math.random().toString(36).substring(2, 6) + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }
});

const cpUpload = upload.fields([
    { name: 'proposalFile', maxCount: 1 },
    { name: 'imagesFiles', maxCount: 3 }
]);

// Helper for extracting project metadata from body
function parseMetadata(body) {
    return {
        projectTitle: body.projectTitle || body.projectDescription ? (body.projectDescription.substring(0, 45) + "...") : "Academic Project",
        projectDescription: body.projectDescription || body.idea || "",
        projectDomain: body.projectDomain || "Software Engineering",
        techStack: typeof body.techStack === 'string' ? body.techStack : JSON.stringify(body.techStack || []),
        duration: body.duration || "8 Weeks",
        teamSize: body.teamSize || "2"
    };
}

// ==========================================
// INDIVIDUAL AGENT TRIGGER ENDPOINTS
// ==========================================

// 1. Feasibility Analysis Agent Endpoint
router.post("/agent/feasibility", async (req, res) => {
    try {
        const metadata = parseMetadata(req.body);
        const report = await agents.feasibilityAnalysisAgent(metadata);
        res.json({ success: true, agent: "Feasibility Analysis Agent 🔍", report });
    } catch (e) {
        res.status(500).json({ success: false, message: e.message });
    }
});

// 2. Scope Definition & MVP Agent Endpoint
router.post("/agent/scope", async (req, res) => {
    try {
        const metadata = parseMetadata(req.body);
        const report = await agents.scopeDefinitionAgent(metadata);
        res.json({ success: true, agent: "Scope Definition Agent 🎯", report });
    } catch (e) {
        res.status(500).json({ success: false, message: e.message });
    }
});

// 3. Tech Stack Recommendation Agent Endpoint
router.post("/agent/tech", async (req, res) => {
    try {
        const metadata = parseMetadata(req.body);
        const report = await agents.technologyRecommendationAgent(metadata);
        res.json({ success: true, agent: "Tech Stack Agent ⚙️", report });
    } catch (e) {
        res.status(500).json({ success: false, message: e.message });
    }
});

// 4. Milestone & Timeline Agent Endpoint
router.post("/agent/timeline", async (req, res) => {
    try {
        const metadata = parseMetadata(req.body);
        const report = await agents.timelinePlanningAgent(metadata);
        res.json({ success: true, agent: "Timeline Planning Agent 📅", report });
    } catch (e) {
        res.status(500).json({ success: false, message: e.message });
    }
});

// ==========================================
// Submit Project (UNIFIED MULTI-AGENT PIPELINE)
// ==========================================
router.post("/", (req, res) => {
    cpUpload(req, res, async function (err) {
        if (err instanceof multer.MulterError) {
            return res.status(400).json({ success: false, message: `Upload limits violated: ${err.message}` });
        } else if (err) {
            return res.status(500).json({ success: false, message: `System upload failure: ${err.message}` });
        }

        const body = req.body || {};
        const proposalFile = req.files && req.files['proposalFile'] ? req.files['proposalFile'][0].filename : "";
        const imagesCount = req.files && req.files['imagesFiles'] ? req.files['imagesFiles'].length : 0;

        const projectMetadata = parseMetadata(body);

        let feasibilityResults, structuredScope, techRecommendations, weeklyTimeline;

        try {
            console.log("🚀 Executing Multi-Agent Pipeline...");
            const reports = await agents.processUnifiedProjectPipeline(projectMetadata);
            feasibilityResults = reports.feasibility;
            structuredScope = reports.scope;
            techRecommendations = reports.stack;
            weeklyTimeline = reports.timeline;
        } catch (aiError) {
            console.error("⚠️ AI Agent Processing Error:", aiError);
            const errMsg = `### ⚠️ Generation Failure\n**Details:** \`${aiError.message || aiError}\``;
            feasibilityResults = errMsg;
            structuredScope = errMsg;
            techRecommendations = errMsg;
            weeklyTimeline = errMsg;
        }

        const sql = `
        INSERT INTO projects
        (
            studentName, studentEmail, projectTitle, projectDomain, projectCategory,
            teamSize, duration, difficulty, techStack, projectDescription,
            problemStatement, expectedOutcome, proposalFile, imagesCount, status,
            submittedOn, feasibility_report, scope_report, tech_report, timeline_report
        )
        VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;

        db.query(
            sql,
            [
                body.studentName || "Anonymous",
                body.studentEmail || "",
                projectMetadata.projectTitle,
                body.projectDomain || "",
                body.projectCategory || "",
                parseInt(projectMetadata.teamSize) || 1,
                projectMetadata.duration,
                body.difficulty || "",
                projectMetadata.techStack, 
                projectMetadata.projectDescription,
                body.problemStatement || "",
                body.expectedOutcome || "",
                proposalFile,
                imagesCount,
                "Processed", 
                body.submittedOn || new Date().toLocaleString(),
                feasibilityResults,
                structuredScope,
                techRecommendations,
                weeklyTimeline
            ],
            (dbErr, result) => {
                if (dbErr) {
                    console.error("❌ MySQL Error:", dbErr);
                    // Return AI response even if database connection is offline
                    return res.json({
                        success: true,
                        message: "Project processed by agentic pipeline (DB offline log).",
                        projectId: Math.floor(1000 + Math.random() * 9000),
                        ai_analysis: {
                            feasibility: feasibilityResults,
                            scope: structuredScope,
                            stack: techRecommendations,
                            timeline: weeklyTimeline
                        }
                    });
                }
                
                res.json({
                    success: true,
                    message: "Project processed by agentic pipeline and saved!",
                    projectId: result.insertId,
                    ai_analysis: {
                        feasibility: feasibilityResults,
                        scope: structuredScope,
                        stack: techRecommendations,
                        timeline: weeklyTimeline
                    }
                });
            }
        );
    });
});

// ==============================
// Get My Projects 
// ==============================
router.get("/student/:email", (req, res) => {
    const email = req.params.email;
    const sql = "SELECT * FROM projects WHERE studentEmail=? ORDER BY id DESC";

    db.query(sql, [email], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ success: false, message: "Failed to retrieve student projects." });
        }
        res.json(result);
    });
});

// ==============================
// Get Single Project
// ==============================
router.get("/view/:id", (req, res) => {
    const id = req.params.id;

    db.query("SELECT * FROM projects WHERE id=?", [id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ success: false, message: "Database query execution error." });
        }
        if (result.length === 0) {
            return res.status(404).json({ success: false, message: "Project Not Found" });
        }
        res.json(result[0]);
    });
});

// ==============================
// Update Project
// ==============================
router.put("/:id", (req, res) => {
    const id = req.params.id;
    const { projectTitle, projectDomain, projectCategory, teamSize, duration, difficulty, techStack, projectDescription, problemStatement, expectedOutcome } = req.body;

    const sql = `
    UPDATE projects
    SET projectTitle=?, projectDomain=?, projectCategory=?, teamSize=?, duration=?, difficulty=?, techStack=?, projectDescription=?, problemStatement=?, expectedOutcome=?
    WHERE id=?`;

    db.query(
        sql,
        [projectTitle, projectDomain, projectCategory, parseInt(teamSize) || 1, duration, difficulty, typeof techStack === 'string' ? techStack : JSON.stringify(techStack), projectDescription, problemStatement, expectedOutcome, id],
        (err) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ success: false, message: "Update failed." });
            }
            res.json({ success: true, message: "Project Updated" });
        }
    );
});

// ==============================
// Delete Project
// ==============================
router.delete("/:id", (req, res) => {
    const id = req.params.id;
    db.query("DELETE FROM projects WHERE id=?", [id], (err) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ success: false, message: "Deletion error." });
        }
        res.json({ success: true, message: "Project Deleted" });
    });
});

module.exports = router;