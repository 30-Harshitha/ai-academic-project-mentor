const express = require("express");
const router = express.Router();
// Link directly to the db instance initialized in server.js
const db = require("../server");

// ===========================
// Register User
// ===========================
router.post("/register", (req, res) => {
    const {
        fullName,
        email,
        phoneNumber,
        dob,
        collegeName,
        department,
        year,
        gender,
        githubUrl,
        linkedinUrl,
        password
    } = req.body;

    db.query(
        "SELECT * FROM users WHERE email=?",
        [email],
        (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ success: false, message: "Database lookup error occurred." });
            }

            if (result.length > 0) {
                return res.json({
                    success: false,
                    message: "Email already registered."
                });
            }

            const sql = `
            INSERT INTO users
            (fullName, email, phoneNumber, dob, collegeName, department, year, gender, githubUrl, linkedinUrl, password)
            VALUES (?,?,?,?,?,?,?,?,?,?,?)
            `;

            db.query(
                sql,
                [fullName, email, phoneNumber, dob, collegeName, department, year, gender, githubUrl, linkedinUrl, password],
                (err) => {
                    if (err) {
                        console.error(err);
                        return res.status(500).json({ success: false, message: "Failed to write data to database." });
                    }

                    res.json({
                        success: true,
                        message: "Registration Successful"
                    });
                }
            );
        }
    );
});

// ===========================
// Login
// ===========================
router.post("/login", (req, res) => {
    const { email, password } = req.body;

    db.query(
        "SELECT * FROM users WHERE email=? AND password=?",
        [email, password],
        (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ success: false, message: "Database authentication error." });
            }

            if (result.length === 0) {
                return res.json({
                    success: false,
                    message: "Invalid Email or Password"
                });
            }

            res.json({
                success: true,
                user: result[0]
            });
        }
    );
});

// ===========================
// Get Profile
// ===========================
router.get("/:email", (req, res) => {
    db.query(
        "SELECT * FROM users WHERE email=?",
        [req.params.email],
        (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ success: false, message: "Profile retrieval database error." });
            }

            if (result.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: "User not found"
                });
            }

            res.json(result[0]);
        }
    );
});

// ===========================
// Update Profile
// ===========================
router.put("/:email", (req, res) => {
    const email = req.params.email;
    const {
        fullName,
        phoneNumber,
        dob,
        collegeName,
        department,
        year,
        gender,
        githubUrl,
        linkedinUrl,
        location,
        programmingLanguages,
        certifications,
        experience,
        skillsList,
        avatarUrl
    } = req.body;

    const sql = `
    UPDATE users
    SET
        fullName=?, phoneNumber=?, dob=?, collegeName=?, department=?, year=?, gender=?,
        githubUrl=?, linkedinUrl=?, location=?, programmingLanguages=?, certifications=?,
        experience=?, skillsList=?, avatarUrl=?
    WHERE email=?
    `;

    db.query(
        sql,
        [fullName, phoneNumber, dob, collegeName, department, year, gender, githubUrl, linkedinUrl, location, programmingLanguages, certifications, experience, skillsList, avatarUrl, email],
        (err) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ success: false, message: "Profile updates failed to persist." });
            }

            res.json({
                success: true,
                message: "Profile Updated Successfully"
            });
        }
    );
});

// ===========================
// Save Assessment
// ===========================
router.post("/assessment", (req, res) => {
    const { email, score, level, skills } = req.body;

    const sql = `
    UPDATE users
    SET assessmentScore=?, assessmentLevel=?, techSkills=?
    WHERE email=?
    `;

    db.query(
        sql,
        [score, level, skills, email],
        (err) => {
            if (err) {
                console.error(err);
                return res.status(500).json({
                    success: false,
                    message: "Database Error saving custom diagnostics results."
                });
            }

            res.json({
                success: true,
                message: "Assessment Saved Successfully"
            });
        }
    );
});

module.exports = router;