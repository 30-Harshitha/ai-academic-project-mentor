// ==========================================
// MySQL Database Connection Pool
// db.js
// ==========================================

const mysql = require("mysql2");

// Create MySQL Connection Pool with safe environment fallbacks
const pool = mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "Harshitha@8088", 
    database: process.env.DB_NAME || "ai_project_mentor",
    port: parseInt(process.env.DB_PORT) || 3306,
    waitForConnections: true,
    connectionLimit: 10, // Maintain up to 10 persistent pipeline threads
    queueLimit: 0
});

// Verify connection health on startup
pool.getConnection((err, connection) => {
    if (err) {
        console.error("❌ MySQL Pool Initialization Failed!");
        console.error(err.message);
        return;
    }
    console.log("✅ Connected to MySQL Database instance successfully via shared connection pool!");
    connection.release(); // Return connection back to the pool ecosystem
});

// Export connection pool instance (API matches .query execution perfectly)
module.exports = pool;