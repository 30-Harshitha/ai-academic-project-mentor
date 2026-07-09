// ==========================================
// MySQL Database Connection
// db.js
// ==========================================

const mysql = require("mysql2");

// Create MySQL Connection
const db = mysql.createConnection({

    host: "localhost",

    user: "root",

    password: "Harshitha@8088",       // Change if your MySQL password is different

    database: "ai_project_mentor"

});

// Connect to MySQL
db.connect((err) => {

    if (err) {

        console.error("❌ MySQL Connection Failed");

        console.error(err);

        return;

    }

    console.log("✅ Connected to MySQL Database");

});

// Export connection
module.exports = db;
