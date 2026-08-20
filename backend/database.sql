-- ========================================================
-- 1. DROP & RE-CREATE THE TARGET DATABASE
-- ========================================================
DROP DATABASE IF EXISTS ai_project_mentor;
CREATE DATABASE ai_project_mentor;
USE ai_project_mentor;

-- ========================================================
-- 2. CREATE THE USERS TABLE
-- ========================================================
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    fullName VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phoneNumber VARCHAR(15),
    dob DATE,
    collegeName VARCHAR(150),
    department VARCHAR(100),
    year VARCHAR(20),
    gender VARCHAR(20),
    githubUrl VARCHAR(255),
    linkedinUrl VARCHAR(255),
    password VARCHAR(255) NOT NULL,
    location VARCHAR(150),
    programmingLanguages TEXT,
    certifications TEXT,
    experience TEXT,
    skillsList TEXT,
    avatarUrl TEXT,
    assessmentScore INT DEFAULT 0,
    assessmentLevel VARCHAR(50),
    techSkills TEXT,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================================================
-- 3. CREATE THE PROJECTS TABLE WITH NATIVE REPORT COLUMNS
-- ========================================================
CREATE TABLE projects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    studentName VARCHAR(100) DEFAULT 'Anonymous',
    studentEmail VARCHAR(100) NOT NULL,
    projectTitle VARCHAR(200) NOT NULL,
    projectDomain VARCHAR(100),
    projectCategory VARCHAR(100),
    teamSize INT DEFAULT 1, 
    duration VARCHAR(50),
    difficulty VARCHAR(50),
    techStack TEXT,
    projectDescription TEXT,
    problemStatement TEXT,
    expectedOutcome TEXT,
    proposalFile TEXT,
    imagesCount INT DEFAULT 0,
    status VARCHAR(50) DEFAULT 'Processed',
    submittedOn VARCHAR(100),
    
    -- AI Generated Markdown Reports
    feasibility_report LONGTEXT,   
    scope_report LONGTEXT,
    tech_report LONGTEXT,
    timeline_report LONGTEXT,
    
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX(studentEmail)        
);

-- ========================================================
-- 4. VERIFY THE SCHEMA WAS CREATED CORRECTLY
-- ========================================================
SELECT * FROM users;
SELECT * FROM projects;
SHOW TABLES;
DESCRIBE projects;