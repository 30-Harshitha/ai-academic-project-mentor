// ==========================================
// routes/projects.js
// ==========================================

const express = require("express");
const router = express.Router();
const db = require("../db");
const multer = require("multer");
const path = require("path");

// Configure local storage rules
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/"); // Make sure an 'uploads' folder exists in your backend root folder!
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    }
});

const upload = multer({ storage: storage });

// Map frontend file fields 
const cpUpload = upload.fields([
    { name: 'proposalFile', maxCount: 1 },
    { name: 'imagesFiles', maxCount: 3 }
]);

// ==============================
// Submit Project (🟢 FIXED MULTIPART PARSING)
// ==============================
router.post("/", cpUpload, (req, res) => {
    // fields parsed from multipart/form-data reside inside req.body
    const body = req.body;

    if (!body || Object.keys(body).length === 0) {
        return res.status(400).json({
            success: false,
            message: "Data parsing failed. Check multipart middleware mapping configurations."
        });
    }

    // Safely extract file paths/names populated by multer
    const proposalFile = req.files && req.files['proposalFile'] ? req.files['proposalFile'][0].filename : "";
    const imagesCount = req.files && req.files['imagesFiles'] ? req.files['imagesFiles'].length : 0;

    const sql = `
    INSERT INTO projects
    (
        studentName,
        studentEmail,
        projectTitle,
        projectDomain,
        projectCategory,
        teamSize,
        duration,
        difficulty,
        techStack,
        projectDescription,
        problemStatement,
        expectedOutcome,
        proposalFile,
        imagesCount,
        status,
        submittedOn
    )
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
    `;

    db.query(
        sql,
        [
            body.studentName || "Anonymous",
            body.studentEmail || "",
            body.projectTitle || "",
            body.projectDomain || "",
            body.projectCategory || "",
            parseInt(body.teamSize) || 1,
            body.duration || "",
            body.difficulty || "",
            body.techStack || "[]", 
            body.projectDescription || "",
            body.problemStatement || "",
            body.expectedOutcome || "",
            proposalFile,
            imagesCount,
            body.status || "Submitted",
            body.submittedOn || new Date().toLocaleString()
        ],
        (err, result) => {
            if (err) {
                console.error("❌ MySQL Error:", err);
                return res.status(500).json({ success: false, error: err.message });
            }
            res.json({
                success: true,
                message: "Project Submitted Successfully",
                projectId: result.insertId
            });
        }
    );
});

// ==============================
// Get My Projects (🟢 PATH VERIFIED TO AVOID COLLISION)
// ==============================
router.get("/student/:email", (req, res) => {
    const email = req.params.email;
    const sql = "SELECT * FROM projects WHERE studentEmail=? ORDER BY id DESC";

    db.query(sql, [email], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json(result);
    });
});

// ==============================
// Get Single Project
// ==============================
router.get("/view/:id", (req, res) => {
    const id = req.params.id;

    db.query("SELECT * FROM projects WHERE id=?", [id], (err, result) => {
        if (err) return res.status(500).json(err);
        if (result.length === 0) {
            return res.json({
                success: false,
                message: "Project Not Found"
            });
        }
        res.json(result[0]);
    });
});

// ==============================
// Update Project
// ==============================
router.put("/:id", (req, res) => {
    const id = req.params.id;
    const {
        projectTitle,
        projectDomain,
        projectCategory,
        teamSize,
        duration,
        difficulty,
        techStack,
        projectDescription,
        problemStatement,
        expectedOutcome
    } = req.body;

    const sql = `
    UPDATE projects
    SET
        projectTitle=?,
        projectDomain=?,
        projectCategory=?,
        teamSize=?,
        duration=?,
        difficulty=?,
        techStack=?,
        projectDescription=?,
        problemStatement=?,
        expectedOutcome=?
    WHERE id=?
    `;

    db.query(
        sql,
        [
            projectTitle,
            projectDomain,
            projectCategory,
            teamSize,
            duration,
            difficulty,
            typeof techStack === 'string' ? techStack : JSON.stringify(techStack), 
            projectDescription,
            problemStatement,
            expectedOutcome,
            id
        ],
        (err) => {
            if (err) return res.status(500).json(err);
            res.json({
                success: true,
                message: "Project Updated"
            });
        }
    );
});

// ==============================
// Delete Project
// ==============================
router.delete("/:id", (req, res) => {
    const id = req.params.id;

    db.query("DELETE FROM projects WHERE id=?", [id], (err) => {
        if (err) return res.status(500).json(err);
        res.json({
            success: true,
            message: "Project Deleted"
        });
    });
});

module.exports = router;