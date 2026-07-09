CREATE DATABASE IF NOT EXISTS ai_project_mentor;

USE ai_project_mentor;

CREATE TABLE users (

    id INT AUTO_INCREMENT PRIMARY KEY,

    fullName VARCHAR(100) NOT NULL,

    email VARCHAR(100) NOT NULL UNIQUE,

    phoneNumber VARCHAR(20),

    dob DATE,

    collegeName VARCHAR(150),

    department VARCHAR(100),

    year VARCHAR(20),

    gender VARCHAR(20),

    githubUrl VARCHAR(255),

    linkedinUrl VARCHAR(255),

    password VARCHAR(255),

    profileImage VARCHAR(255),

    skills TEXT,

    assessmentCompleted BOOLEAN DEFAULT FALSE,

    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP

);

CREATE TABLE projects (

    id INT AUTO_INCREMENT PRIMARY KEY,

    studentName VARCHAR(100),

    studentEmail VARCHAR(100),

    projectTitle VARCHAR(200),

    projectDomain VARCHAR(100),

    projectCategory VARCHAR(100),

    teamSize INT,

    duration VARCHAR(50),

    difficulty VARCHAR(50),

    techStack TEXT,

    projectDescription TEXT,

    problemStatement TEXT,

    expectedOutcome TEXT,

    proposalFile VARCHAR(255),

    imagesCount INT,

    status VARCHAR(50),

    submittedOn VARCHAR(100)

);