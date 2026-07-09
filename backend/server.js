const express = require("express");
const router = express.Router();
const db = require("../server");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Ensure target upload directory exists securely at startup
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure absolute storage resolution pathing
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir); 
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname.replace(/\s+/g, "_"));
    }
});

const upload = multer({ storage: storage });

const cpUpload = upload.fields([
    { name: 'proposalFile', maxCount: 1 },
    { name: 'imagesFiles', maxCount: 3 }
]);

// ==============================
// 🚀 Submit Project (multipart/form-data)
// ==============================
router.post("/", cpUpload, (req, res) => {
    try {
        const body = req.body;

        if (!body || Object.keys(body).length === 0) {
            return res.status(400).json({
                success: false,
                message: "Data parsing failed. Check multipart middleware configuration."
            });
        }

        // Safely pull file identifiers without runtime pointer exceptions
        let proposalFile = "";
        if (req.files && req.files['proposalFile'] && req.files['proposalFile'][0]) {
            proposalFile = req.files['proposalFile'][0].filename;
        }

        let imagesCount = 0;
        if (req.files && req.files['imagesFiles']) {
            imagesCount = req.files['imagesFiles'].length;
        }

        const fallbackDate = new Date().toISOString().slice(0, 19).replace('T', ' ');
        const submissionDate = body.submittedOn && body.submittedOn.trim() !== "" ? body.submittedOn : fallbackDate;

        const sql = `
        INSERT INTO projects
        (
            studentName, studentEmail, projectTitle, projectDomain, projectCategory,
            teamSize, duration, difficulty, techStack, projectDescription,
            problemStatement, expectedOutcome, proposalFile, imagesCount, status, submittedOn
        )
        VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
        `;

        const values = [
            body.studentName || "Anonymous",
            body.studentEmail || "",
            body.projectTitle || "Untitled Project",
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
            submissionDate
        ];

        db.query(sql, values, (err, result) => {
            if (err) {
                console.error("❌ MySQL Error:", err);
                return res.status(500).json({ 
                    success: false, 
                    message: "Database insertion failure.", 
                    error: err.message 
                });
            }
            return res.json({
                success: true,
                message: "Project Submitted Successfully",
                projectId: result.insertId
            });
        });

    } catch (catchErr) {
        console.error("❌ Controller Error Exception:", catchErr);
        return res.status(500).json({
            success: false,
            message: "Internal server processing failure.",
            error: catchErr.message
        });
    }
});

// ==============================
// 📋 Get My Projects
// ==============================
router.get("/student/:email", (req, res) => {
    const email = req.params.email;
    const sql = "SELECT * FROM projects WHERE studentEmail=? ORDER BY id DESC";

    db.query(sql, [email], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ success: false, message: "Failed to load project listings." });
        }
        res.json({
            success: true,
            projects: result
        });
    });
});

// ==============================
// 👁️ Get Single Project
// ==============================
router.get("/view/:id", (req, res) => {
    const id = req.params.id;

    db.query("SELECT * FROM projects WHERE id=?", [id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ success: false, message: "Failed to access single project metadata." });
        }
        if (result.length === 0) {
            return res.json({
                success: false,
                message: "Project Not Found"
            });
        }
        res.json({
            success: true,
            project: result[0]
        });
    });
});

// ==============================
// 🔄 Update Project
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
        projectTitle=?, projectDomain=?, projectCategory=?, teamSize=?, duration=?,
        difficulty=?, techStack=?, projectDescription=?, problemStatement=?, expectedOutcome=?
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
            if (err) {
                console.error(err);
                return res.status(500).json({ success: false, message: "Project update failed to persist." });
            }
            res.json({
                success: true,
                message: "Project Updated"
            });
        }
    );
});

// ==============================
// 🗑️ Delete Project
// ==============================
router.delete("/:id", (req, res) => {
    const id = req.params.id;

    db.query("DELETE FROM projects WHERE id=?", [id], (err) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ success: false, message: "Unable to complete delete operations." });
        }
        res.json({
            success: true,
            message: "Project Deleted"
        });
    });
});

module.exports = router;