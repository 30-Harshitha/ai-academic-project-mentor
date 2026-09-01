// ==========================================
// services/aiAgents.js (Granular Multi-Agent Engine & Dynamic Project Analytics)
// ==========================================
const { GoogleGenAI } = require("@google/genai");

// Initialize Google AI with local environment API key
const apiKey = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI(apiKey ? { apiKey } : {});
const MODEL_NAME = 'gemini-2.5-flash';

/**
 * Dynamic Feasibility Score Calculator
 */
function calculateDynamicFeasibilityScore(meta, text) {
    let score = 85; // Baseline standard score
    
    // Domain & Tech Complexity Adjustments
    if (text.includes("blockchain") || text.includes("quantum") || text.includes("robotics") || text.includes("satellite") || text.includes("crypto")) {
        score -= 14; // High-complexity hardware/crypto challenge (~71%)
    } else if (text.includes("e-commerce") || text.includes("ecommerce") || text.includes("crud") || text.includes("management") || text.includes("portal") || text.includes("catalog")) {
        score += 9; // Highly feasible web/mobile system (~94%)
    } else if (text.includes("health") || text.includes("medical") || text.includes("patient") || text.includes("tumor") || text.includes("diagnostic")) {
        score += 4; // Moderate-high feasibility (~89%)
    } else if (text.includes("iot") || text.includes("sensor") || text.includes("agriculture") || text.includes("hardware")) {
        score += 2; // IoT system (~87%)
    } else if (text.includes("ai") || text.includes("nlp") || text.includes("vision") || text.includes("detect")) {
        score += 3; // AI/ML project (~88%)
    }

    // Team Size Adjustments
    const teamSize = parseInt(meta.teamSize) || 2;
    if (teamSize >= 4) score += 4;
    else if (teamSize === 3) score += 2;
    else if (teamSize === 1) score -= 6; // Single-student project

    // Duration Adjustments
    const weeks = parseInt(meta.duration) || 8;
    if (weeks >= 12) score += 4;
    else if (weeks >= 8) score += 1;
    else if (weeks <= 4) score -= 8;

    // Clamp score strictly between 62% and 96%
    score = Math.max(62, Math.min(96, score));
    
    let rating = "HIGH ACADEMIC VIABILITY";
    if (score < 75) rating = "MODERATE VIABILITY (Requires Scope Trimming)";
    else if (score >= 91) rating = "EXCEPTIONAL ACADEMIC VIABILITY";

    return { score, rating };
}

/**
 * Rich Project Context Analyzer
 */
function analyzeProjectContext(meta) {
    const title = meta.projectTitle || (meta.projectDescription ? (meta.projectDescription.substring(0, 50) + "...") : "Academic Project");
    const desc = meta.projectDescription || meta.description || "Comprehensive academic project build.";
    const text = (title + " " + desc + " " + (meta.techStack || "")).toLowerCase();
    
    const { score: feasibilityScore, rating: feasibilityRating } = calculateDynamicFeasibilityScore(meta, text);

    const weeks = parseInt(meta.duration) || 8;
    const hrsPerWk = parseInt(meta.weeklyHours) || 10;
    const teamSize = parseInt(meta.teamSize) || 2;
    const totalStudentHours = weeks * hrsPerWk;
    const totalTeamHours = totalStudentHours * teamSize;

    let domain = "Software Engineering & Web Architecture";
    let category = "Full-Stack System";
    let mvpFeatures = [];
    let stretchFeatures = [];
    let techStack = {};
    let risks = [];
    let milestoneDetails = {};

    if (text.includes("health") || text.includes("medical") || text.includes("patient") || text.includes("doctor") || text.includes("disease") || text.includes("tumor") || text.includes("diagnostic")) {
        domain = "Healthcare & Biomedical Intelligence";
        category = "Medical AI & Clinical Decision Support";
        mvpFeatures = [
            "Patient Profile & Diagnostic Data Ingestion Portal (Support DICOM / Image Uploads)",
            "Real-Time Health Metric & Medical Imaging Analysis Engine using CNN / PyTorch",
            "Risk Scoring & Predictive Diagnostic Alerts Module for Clinical Reviews",
            "Secure HIPAA-Compliant Medical Summary & PDF Report Exporter for Physicians"
        ];
        stretchFeatures = [
            "Integration with DICOM Web Medical Viewer APIs for Interactive Radiology Views",
            "Telemedicine Video Consult Scheduling Integration via WebRTC",
            "Automated Multi-lingual Patient Advisory Assistant using Gemini Flash LLM"
        ];
        techStack = {
            frontend: "React.js 18 + HTML5 / Chart.js for Medical Telemetry Visualization",
            backend: "Node.js (Express) REST API + Python FastAPI for Model Inference",
            database: "PostgreSQL / MySQL with Encrypted Medical Records Schema",
            ai: "PyTorch / TensorFlow Medical Classifier & Scikit-Learn Risk Models",
            devops: "Docker Containerized Deployment on Render / AWS Medical Sandbox"
        };
        risks = [
            "Medical Data Privacy & HIPAA Compliance Regulation Standards",
            "Model Inference Latency on Complex High-Resolution Imaging Datasets",
            "Scarcity of Anonymized Clinical Datasets for Model Training"
        ];
        milestoneDetails = {
            m1: `• Conduct literature survey on medical image processing algorithms for ${title}.\n• Design database schema for patient profiles, medical imaging metadata, and diagnosis logs.\n• Build student onboarding & project setup interface for ${title}.\n• Set up local DICOM image sample dataset (500+ anonymized scans).`,
            m2: `• Develop CNN diagnostic model in PyTorch/TensorFlow for ${title}.\n• Build REST API endpoints (/api/diagnose, /api/patients) in Node.js/FastAPI.\n• Connect React frontend with health telemetry gauges & diagnostic file dropzone.\n• Execute Feasibility and Scope Agent validation scripts.`,
            m3: `• Conduct Risk Assessment Agent evaluation — mitigate DICOM inference latency.\n• Implement Nova AI Medical Advisor chat desk for student query support.\n• Log Weekly Check-ins (Weeks 5-6) & test patient report PDF exporter.\n• Conduct faculty guidance review & apply feedback callouts.`,
            m4: `• Build Faculty Monitoring Dashboard with student health digest badges.\n• Run automated end-to-end unit tests (UT-001 to UT-007 PASS).\n• Optimize medical model inference speed below 500ms.\n• Prepare 25-slide defense presentation deck & final technical project synopsis.`
        };
    } else if (text.includes("e-commerce") || text.includes("ecommerce") || text.includes("shop") || text.includes("retail") || text.includes("product") || text.includes("cart") || text.includes("recommend")) {
        domain = "E-Commerce & Intelligent Retail Systems";
        category = "Smart Commerce & Personalization Platform";
        mvpFeatures = [
            "Dynamic Product Catalog & Category Inventory Management with Search & Filtering",
            "AI Collaborative Filtering Product Recommendation Engine tailored to user history",
            "Interactive Shopping Cart & Stripe / PayPal Checkout Webhook Integration",
            "User Order Tracking & Purchase History Analytics Dashboard for Merchants"
        ];
        stretchFeatures = [
            "AR Product 3D Preview Plugin for Mobile Web Browsers",
            "Automated Dynamic Pricing & Inventory Low-Stock Email Alerts",
            "Multi-Currency & Regional Tax Calculator Middleware"
        ];
        techStack = {
            frontend: "React.js 18 + HTML5 + Redux Toolkit for Shopping Cart State",
            backend: "Node.js (Express) REST API + Stripe Payment Gateway Webhooks",
            database: "MySQL / PostgreSQL (Products & Orders) + Redis Session Cache",
            ai: "Scikit-Learn Collaborative Filtering & Content-Based Recommenders",
            devops: "Vercel / Heroku Cloud Hosting with CDN Asset Caching"
        };
        risks = [
            "Cart State Synchronization Errors During High Traffic Bursts",
            "Cold-Start Problem for Newly Added Products in Recommendation Models",
            "Third-Party Payment Gateway Webhook Latency & Timeout Risks"
        ];
        milestoneDetails = {
            m1: `• Analyze e-commerce workflows and catalog structures for ${title}.\n• Design relational database ERD for Users, Products, Shopping Cart, and Orders.\n• Build project idea submission desk and skill assessment matrix.\n• Mock sample product inventory catalog with 200+ items.`,
            m2: `• Build AI Collaborative Filtering recommendation pipeline in Scikit-Learn.\n• Implement Node.js Express REST API routes (/api/products, /api/cart, /api/checkout).\n• Develop frontend interactive shopping cart & Stripe webhook simulator.\n• Validate product recommendation accuracy against test order histories.`,
            m3: `• Execute Risk Assessment Agent — resolve shopping cart session sync issues.\n• Integrate Nova AI Commerce Mentor for weekly student check-in guidance.\n• Build automated merchant analytics dashboard & sales summary exporter.\n• Log Milestone 3 progress updates and faculty feedback notes.`,
            m4: `• Finalize Faculty Supervisory View for real-time e-commerce project tracking.\n• Run full unit test suite (UT-001 to UT-007 PASS) for cart & payment pipelines.\n• Conduct UI responsiveness & speed optimization (<200ms API response).\n• Prepare final presentation slides & project defense demonstration.`
        };
    } else if (text.includes("blockchain") || text.includes("crypto") || text.includes("quantum")) {
        domain = "Blockchain & Distributed Ledger Security";
        category = "Decentralized Smart Contract Architecture";
        mvpFeatures = [
            "Decentralized User Wallet Authentication & Identity Verification (MetaMask / Ethers.js)",
            "Solidity Smart Contract Execution & Immutable Ledger Audit Engine",
            "Transaction Gas Fee Calculator & Receipt Generation Module",
            "Decentralized File Storage Integration (IPFS) for Document Hashing"
        ];
        stretchFeatures = [
            "Zero-Knowledge Proof (zk-SNARKs) Transaction Anonymization",
            "Cross-Chain Token Bridge Middleware",
            "Automated Smart Contract Vulnerability Scanner"
        ];
        techStack = {
            frontend: "React.js + Ethers.js / Web3.js Wallet Integration",
            backend: "Node.js (Express) + Ethereum JSON-RPC Provider",
            database: "IPFS Distributed File System + PostgreSQL Cache Index",
            ai: "Solidity Hardhat / Foundry Smart Contract Compiler",
            devops: "Alchemy / Infura Node Gateway Deployment"
        };
        risks = [
            "High Gas Fees and Network Latency during Blockchain Transactions",
            "Smart Contract Security Reentrancy & Vulnerability Exploits",
            "Complexity of Testing Decentralized Nodes in Local Environment"
        ];
        milestoneDetails = {
            m1: `• Study Solidity smart contract patterns and EVM architecture for ${title}.\n• Design immutable ledger schema and IPFS hashing data flow.\n• Set up local Hardhat / Anvil blockchain test network environment.\n• Initialize student onboarding & crypto project submission desk.`,
            m2: `• Write and compile Solidity smart contracts for ${title}.\n• Connect Web3.js / Ethers.js frontend wallet login & transaction triggers.\n• Implement Node.js API middleware for transaction history indexing.\n• Test smart contract execution against local Ethereum testnet.`,
            m3: `• Run Risk Assessment Agent — audit smart contract reentrancy vulnerabilities.\n• Enable Nova AI Blockchain Mentor for weekly student check-ins.\n• Build transaction log audit report exporter.\n• Apply faculty guidance callouts regarding gas fee optimization.`,
            m4: `• Deploy smart contracts to Sepolia Testnet & verify on Etherscan.\n• Execute automated unit tests (UT-001 to UT-007 PASS).\n• Optimize transaction latency & contract gas consumption.\n• Prepare project defense report & presentation deck.`
        };
    } else if (text.includes("iot") || text.includes("sensor") || text.includes("smart") || text.includes("agriculture") || text.includes("hardware") || text.includes("arduino") || text.includes("raspberry")) {
        domain = "IoT & Embedded Hardware Engineering";
        category = "Smart Telemetry & Hardware Control Platform";
        mvpFeatures = [
            "Hardware Sensor Data Ingestion Gateway via MQTT & HTTP Protocols",
            "Real-Time Telemetry Graph Dashboard & Threshold Alert Engine for Sensors",
            "Automated Actuator / Relay Remote Switch Controller Module",
            "Historical Sensor Data Logging & CSV/PDF Analytics Exporter"
        ];
        stretchFeatures = [
            "Edge AI Model Deployment directly on Raspberry Pi Hardware",
            "Solar Battery Consumption & Power Management Telemetry",
            "SMS Alert Integration via Twilio API Gateway"
        ];
        techStack = {
            frontend: "HTML5 + Chart.js / D3.js Real-time Telemetry Dashboard",
            backend: "Node.js (Express) + Mosquitto MQTT Broker Integration",
            database: "TimescaleDB / MySQL for Time-Series Sensor Logs",
            ai: "Lightweight Anomaly Detection Classifier (Isolation Forests)",
            devops: "AWS IoT Core / Local Edge Server Gateway Deployment"
        };
        risks = [
            "Physical Sensor Component Delivery Delays & Hardware Calibration Errors",
            "Unstable Network Connectivity causing Telemetry Packet Loss",
            "Power Outages Affecting Continuous Sensor Data Logging"
        ];
        milestoneDetails = {
            m1: `• Specify hardware component pinouts (ESP32/Arduino/Raspberry Pi) for ${title}.\n• Design time-series database schema for telemetry sensor data.\n• Set up Mosquitto MQTT broker and test sensor publish/subscribe loops.\n• Build student project submission interface for IoT hardware telemetry.`,
            m2: `• Build real-time IoT dashboard in HTML5/React with live Chart.js gauges.\n• Implement Node.js API endpoints (/api/telemetry, /api/actuators).\n• Deploy Isolation Forest anomaly detection algorithm on sensor readings.\n• Connect physical/simulated sensor streams to backend MQTT broker.`,
            m3: `• Execute Risk Assessment Agent — set up offline packet buffer for connection drops.\n• Connect Nova AI Hardware Mentor for weekly student check-in guidance.\n• Build historical sensor log PDF/CSV report exporter.\n• Record weekly progress updates (Weeks 5-6).`,
            m4: `• Conduct stress testing on hardware telemetry under 1,000 readings/min.\n• Run unit tests (UT-001 to UT-007 PASS) for sensor ingestion pipeline.\n• Finalize Faculty Monitoring Dashboard for live hardware health tracking.\n• Complete project defense presentation deck & final demonstration.`
        };
    } else {
        domain = "Full-Stack Software Engineering & Intelligent Web Architecture";
        category = "Intelligent Academic Software Platform";
        mvpFeatures = [
            `User Authentication & Profile Onboarding Portal for ${title}`,
            `Core Business Logic Processing Engine for ${desc.substring(0, 35)}...`,
            "Interactive Command Dashboard & Metrics Visualization Unit",
            "Automated Report Exporter & Data Summary Generator"
        ];
        stretchFeatures = [
            "Real-time WebSocket Push Notification Manager",
            "Dark Theme / Light Theme Customized UI Toggle",
            "REST API Third-Party Developer Integration Webhooks"
        ];
        techStack = {
            frontend: "HTML5 + Modern CSS3 + Vanilla JavaScript (ES6+) / React",
            backend: "Node.js (Express) REST API Framework",
            database: "MySQL Relational Database with Connection Pooling",
            ai: "Scikit-Learn / Google Gemini API Integration",
            devops: "Render / Vercel Cloud Deployment with SSL Security"
        };
        risks = [
            "Frontend-Backend State Synchronization Delays",
            "Database Schema Indexing Overhead as Data Volume Grows",
            "API Rate Limit Restrictions during Final Verification Testing"
        ];
        milestoneDetails = {
            m1: `• Study domain requirements and architecture for ${title}.\n• Design database ERD tables and API endpoint contracts.\n• Build student onboarding profile & project submission desk.\n• Initialize version control repository and core project structure.`,
            m2: `• Build backend Node.js Express REST API (/api/projects, /api/users).\n• Develop frontend interactive UI pages with responsive Bootstrap layout.\n• Implement core business processing engine for ${title}.\n• Test database connection pooling and CRUD operations.`,
            m3: `• Run Risk Assessment Agent — optimize API response times.\n• Integrate Nova AI mentor chat desk for ongoing weekly check-ins.\n• Build progress tracking & document exporter.\n• Process faculty advisor feedback notes.`,
            m4: `• Launch Faculty Monitoring Dashboard with student health digests.\n• Conduct end-to-end unit tests (UT-001 to UT-007 PASS).\n• Optimize system performance and prompt quality.\n• Prepare technical documentation and final defense presentation.`
        };
    }

    return { title, desc, domain, category, mvpFeatures, stretchFeatures, techStack, risks, feasibilityScore, feasibilityRating, weeks, hrsPerWk, teamSize, totalStudentHours, totalTeamHours, milestoneDetails };
}

/**
 * 1. Feasibility Analysis Agent
 */
async function feasibilityAnalysisAgent(metadata) {
    const ctx = analyzeProjectContext(metadata);
    const prompt = `
    You are the Feasibility & Risk Analysis Agent for an academic project platform.
    Analyze the following project parameters and return a highly detailed, comprehensive markdown report tailored SPECIFICALLY to this submitted project.

    CRITICAL INSTRUCTION: Calculate a dynamic Feasibility Index Score (out of 100) specifically for "${ctx.title}" based on technical complexity, team size (${metadata.teamSize}), target duration (${metadata.duration}), and domain (${ctx.domain}).

    PROJECT METADATA:
    Title: ${ctx.title}
    Description: ${ctx.desc}
    Domain: ${ctx.domain}
    Provided Tech Stack: ${metadata.techStack || 'HTML, CSS, JS, Node.js, MySQL'}
    Target Duration: ${metadata.duration || '8 Weeks'}
    Team Size: ${metadata.teamSize || '2'}

    Include:
    1. ### 🛡️ Overall Feasibility Index (Score out of 100 with Rating for "${ctx.title}")
    2. ### 📊 Key Technical & Domain Strengths (4 granular points specific to ${ctx.domain})
    3. ### ⚠️ Architectural, Resource & Data Risks (Identify 3 execution bottlenecks specific to ${ctx.title})
    4. ### 📈 Complexity Matrix (Score out of 100 for: Frontend, Backend, Database, AI/ML, Hardware/DevOps)
    5. ### 💡 Academic Guidance & Mentor Advice for Stress-Free Execution
    `;

    try {
        if (!apiKey) throw new Error("Gemini API Key missing");
        const response = await ai.models.generateContent({ model: MODEL_NAME, contents: prompt });
        return response.text || generateFallbackFeasibility(metadata);
    } catch (e) {
        return generateFallbackFeasibility(metadata);
    }
}

/**
 * 2. Scope Definition & MVP Agent
 */
async function scopeDefinitionAgent(metadata) {
    const ctx = analyzeProjectContext(metadata);
    const prompt = `
    You are the Scope Definition & Functional Specification Agent for an academic project platform.
    Generate a granular, detailed project scope and MVP feature specification in markdown format tailored SPECIFICALLY to this submitted project.

    PROJECT METADATA:
    Title: ${ctx.title}
    Description: ${ctx.desc}
    Domain: ${ctx.domain}

    Include:
    1. ### 🎯 Detailed Problem Statement & Target Audience Definition for "${ctx.title}"
    2. ### 🚀 Must-Have Core MVP Features (List 4 core specifications with technical details for this project)
    3. ### ✦ Optional & Nice-To-Have Features (3 stretch enhancement goals)
    4. ### 🚫 Out-Of-Scope / Future Release Targets (Items excluded from current semester)
    5. ### 📋 Non-Functional Requirements (Security, Performance, Responsiveness standards)
    `;

    try {
        if (!apiKey) throw new Error("Gemini API Key missing");
        const response = await ai.models.generateContent({ model: MODEL_NAME, contents: prompt });
        return response.text || generateFallbackScope(metadata);
    } catch (e) {
        return generateFallbackScope(metadata);
    }
}

/**
 * 3. Technology Stack Recommendation Agent
 */
async function technologyRecommendationAgent(metadata) {
    const ctx = analyzeProjectContext(metadata);
    const prompt = `
    You are the Architecture & Technology Recommendation Agent for an academic project platform.
    Analyze the project requirements and output an exhaustive tech stack specification in markdown format tailored SPECIFICALLY to this submitted project.

    PROJECT METADATA:
    Title: ${ctx.title}
    Description: ${ctx.desc}
    Domain: ${ctx.domain}

    Include:
    1. ### ⚙️ Recommended Frontend Framework & UI Stack for "${ctx.title}"
    2. ### 🔧 Backend API & Runtime Environment
    3. ### 🗄️ Database & Storage Layer (Schema choice, indexing strategy for ${ctx.domain})
    4. ### 🤖 AI / ML & Data Analytics Engine
    5. ### ☁️ DevOps, CI/CD & Deployment Strategy
    6. ### 💡 Stack Trade-off Rationale (Why this combination is ideal for "${ctx.title}")
    `;

    try {
        if (!apiKey) throw new Error("Gemini API Key missing");
        const response = await ai.models.generateContent({ model: MODEL_NAME, contents: prompt });
        return response.text || generateFallbackTech(metadata);
    } catch (e) {
        return generateFallbackTech(metadata);
    }
}

/**
 * 4. Development Schedule & Milestone Planning Agent
 */
async function timelinePlanningAgent(metadata) {
    const ctx = analyzeProjectContext(metadata);

    const prompt = `
    You are the Resource Timeline & Milestone Planning Agent for an academic project platform.
    Generate a complete, time-constrained week-by-week milestone roadmap in markdown table format tailored SPECIFICALLY to "${ctx.title}".

    PROJECT METADATA:
    Title: ${ctx.title}
    Description: ${ctx.desc}
    Domain: ${ctx.domain}
    Target Duration: ${ctx.weeks} Weeks
    Weekly Available Hours per Student: ${ctx.hrsPerWk} Hours/Week (Total Student Budget: ${ctx.totalStudentHours} Hours)
    Team Size: ${ctx.teamSize} Student(s)

    Output detailed tasks for 4 milestones:
    Milestone 1 (Requirements & Setup): ${ctx.milestoneDetails.m1}
    Milestone 2 (Core Build): ${ctx.milestoneDetails.m2}
    Milestone 3 (Risk & Mentor): ${ctx.milestoneDetails.m3}
    Milestone 4 (Dashboard & Defense): ${ctx.milestoneDetails.m4}
    `;

    try {
        if (!apiKey) throw new Error("Gemini API Key missing");
        const response = await ai.models.generateContent({ model: MODEL_NAME, contents: prompt });
        return response.text || generateFallbackTimeline(metadata);
    } catch (e) {
        return generateFallbackTimeline(metadata);
    }
}

/**
 * 5. Risk Assessment & Mitigation Agent
 */
async function riskAssessmentAgent(metadata) {
    const ctx = analyzeProjectContext(metadata);
    const prompt = `
    You are the Risk Assessment & Mitigation Agent for an academic project platform.
    Analyze the project parameters and generate an exhaustive technical risk matrix with actionable Plan-B fallbacks tailored SPECIFICALLY to "${ctx.title}".

    PROJECT METADATA:
    Title: ${ctx.title}
    Description: ${ctx.desc}
    Domain: ${ctx.domain}

    Include:
    1. ### 🛡️ Technical & Architecture Risks (Identify latency, database, and system integration bottlenecks for "${ctx.title}")
    2. ### 📊 Dataset & Resource Dependency Risks (Data availability, API rate limits, hardware component risks for ${ctx.domain})
    3. ### ⏰ Deadline & Scope Creep Risks
    4. ### 💡 Concrete Plan-B Resolutions & Actionable Mitigations for Each Identified Risk
    `;

    try {
        if (!apiKey) throw new Error("Gemini API Key missing");
        const response = await ai.models.generateContent({ model: MODEL_NAME, contents: prompt });
        return response.text || generateFallbackRisk(metadata);
    } catch (e) {
        return generateFallbackRisk(metadata);
    }
}

/**
 * Unified Pipeline Call
 */
async function processUnifiedProjectPipeline(metadata) {
    const [feasibility, scope, stack, timeline, risk] = await Promise.all([
        feasibilityAnalysisAgent(metadata),
        scopeDefinitionAgent(metadata),
        technologyRecommendationAgent(metadata),
        timelinePlanningAgent(metadata),
        riskAssessmentAgent(metadata)
    ]);

    return { feasibility, scope, stack, timeline, risk };
}

/**
 * Interactive Mentor Chat
 */
async function interactiveMentorAgent({ studentName, message, projectContext }) {
    const contextPrompt = `
    You are an expert AI Academic Mentor assisting student: "${studentName || 'Student'}".
    
    RECENT PROJECT CONTEXT:
    Project Title: ${projectContext ? projectContext.projectTitle : "Academic Project"}
    Tech Stack: ${projectContext ? projectContext.techStack : "Full Stack"}
    STUDENT QUESTION: "${message}"

    Respond concisely, supportively, and in clean Markdown format with actionable technical advice.
    `;
    try {
        if (!apiKey) throw new Error("API Key missing");
        const response = await ai.models.generateContent({ model: MODEL_NAME, contents: contextPrompt });
        return response.text || "I'm here to support your project! Let's break down your issue into simple technical steps.";
    } catch (e) {
        return "I'm here to support your project! Feel free to ask about debugging your backend, structuring your database, or preparing for faculty evaluation.";
    }
}

// Rich Fallback Generators

function generateFallbackFeasibility(meta) {
    const ctx = analyzeProjectContext(meta);
    return `### 🛡️ Feasibility & Risk Analysis Report
* **Project Analyzed**: **"${ctx.title}"** (${ctx.domain})
* **Overall Feasibility Index**: **${ctx.feasibilityScore}/100 (${ctx.feasibilityRating})**
* **Key Technical & Domain Strengths**:
  * **Targeted Domain Alignment**: Fully aligns with core principles of **${ctx.domain}**.
  * **Scope Manageability**: Core MVP features can be built incrementally within the ${ctx.weeks}-week timeline.
  * **Resource & Tooling Availability**: Supported by robust open-source libraries and standard API protocols.
  * **Team Capability Match**: Balanced workload allocation (~${ctx.totalStudentHours} hours/student).
* **Architectural & Execution Risks Identified**:
  * **Risk 1**: ${ctx.risks[0]}
  * **Risk 2**: ${ctx.risks[1]}
  * **Risk 3**: ${ctx.risks[2]}
* **Complexity Metrics**:
  * Frontend UI: ${Math.round(ctx.feasibilityScore * 0.85)}/100 | Backend API: ${Math.round(ctx.feasibilityScore * 0.9)}/100 | Database Schema: ${Math.round(ctx.feasibilityScore * 0.8)}/100 | AI/ML Engine: ${Math.round(ctx.feasibilityScore * 0.85)}/100 | Overall Complexity: Moderate
* **💡 Mentor Insight**: Focus on completing Milestone 1 tasks early. Keep core features modular so testing remains stress-free!`;
}

function generateFallbackScope(meta) {
    const ctx = analyzeProjectContext(meta);
    return `### 🎯 Project Scope & Functional Specifications
* **Project Title**: **"${ctx.title}"**
* **Project Domain**: **${ctx.domain}** (${ctx.category})
* **Problem Statement Summary**: ${ctx.desc}
* **Must-Have Core MVP Features**:
  1. **${ctx.mvpFeatures[0]}**
  2. **${ctx.mvpFeatures[1]}**
  3. **${ctx.mvpFeatures[2]}**
  4. **${ctx.mvpFeatures[3]}**
* **Optional Stretch Features**:
  * **${ctx.stretchFeatures[0]}**
  * **${ctx.stretchFeatures[1]}**
  * **${ctx.stretchFeatures[2]}**
* **Out-of-Scope Targets**:
  * High-concurrency enterprise multi-region cloud deployment (deferred to post-graduation).`;
}

function generateFallbackTech(meta) {
    const ctx = analyzeProjectContext(meta);
    return `### ⚙️ Recommended Technology Architecture
* **Target Project**: **"${ctx.title}"**
* **Frontend UI Stack**: ${ctx.techStack.frontend}
* **Backend API Framework**: ${ctx.techStack.backend}
* **Database & Storage Layer**: ${ctx.techStack.database}
* **AI & Analytical Engine**: ${ctx.techStack.ai}
* **DevOps & Hosting Strategy**: ${ctx.techStack.devops}
* **💡 Stack Trade-off Rationale**: This stack avoids bloated enterprise overhead, saving 2+ weeks of initial setup time while offering full support for building **"${ctx.title}"**.`;
}

function generateFallbackTimeline(meta) {
    const ctx = analyzeProjectContext(meta);
    const m1_hrs = Math.round(ctx.totalStudentHours * 0.25);
    const m2_hrs = Math.round(ctx.totalStudentHours * 0.25);
    const m3_hrs = Math.round(ctx.totalStudentHours * 0.25);
    const m4_hrs = Math.round(ctx.totalStudentHours * 0.25);

    return `### 📅 Time-Constrained Milestone & Timeline Roadmap for "${ctx.title}"

> 📌 **Project**: **"${ctx.title}"** (${ctx.domain})  
> ⏱️ **Time Constraints**: **${ctx.weeks} Weeks Total** | **${ctx.hrsPerWk} Hours/Week per student** | **Team Size: ${ctx.teamSize} Student(s)**  
> 📊 **Budgeted Effort**: **~${ctx.totalStudentHours} Hours per Student** (${ctx.totalTeamHours} Total Team Hours)

| Milestone & Schedule | Core Phase Objectives | Detailed Technical Deliverables for "${ctx.title}" | Budgeted Student Hours |
| :--- | :--- | :--- | :--- |
| **Milestone 1** (Week 1-${Math.max(1, Math.round(ctx.weeks * 0.25))}) | Requirements & Setup | ${ctx.milestoneDetails.m1.replace(/\n/g, '<br>')} | ~${m1_hrs} Hours / student |
| **Milestone 2** (Week ${Math.max(1, Math.round(ctx.weeks * 0.25)) + 1}-${Math.round(ctx.weeks * 0.50)}) | Core Agent Pipeline Build | ${ctx.milestoneDetails.m2.replace(/\n/g, '<br>')} | ~${m2_hrs} Hours / student |
| **Milestone 3** (Week ${Math.round(ctx.weeks * 0.50) + 1}-${Math.round(ctx.weeks * 0.75)}) | Risk, Mentor & Progress | ${ctx.milestoneDetails.m3.replace(/\n/g, '<br>')} | ~${m3_hrs} Hours / student |
| **Milestone 4** (Week ${Math.round(ctx.weeks * 0.75) + 1}-${ctx.weeks}) | Dashboard & Defense Prep | ${ctx.milestoneDetails.m4.replace(/\n/g, '<br>')} | ~${m4_hrs} Hours / student |`;
}

function generateFallbackRisk(meta) {
    const ctx = analyzeProjectContext(meta);
    return `### 🛡️ Risk Assessment & Actionable Mitigation Plan
* **Target Project**: **"${ctx.title}"** (${ctx.domain})

1. **${ctx.risks[0]}**
   * **Identified Bottleneck**: Potential execution delays specific to ${ctx.domain}.
   * **Suggested Resolution / Mitigation**: Use modular architecture and lightweight fallback handlers to guarantee smooth execution under 500ms.

2. **${ctx.risks[1]}**
   * **Identified Bottleneck**: Domain resource or dataset availability bottleneck.
   * **Suggested Resolution / Mitigation**: Leverage open-source synthetic sample datasets combined with local processing fallbacks.

3. **${ctx.risks[2]}**
   * **Identified Bottleneck**: Third-party API syntax or component integration risks.
   * **Suggested Resolution / Mitigation**: Implement local mocked data providers to keep MVP deliverables fully functional during faculty evaluation.`;
}

module.exports = {
    processUnifiedProjectPipeline,
    interactiveMentorAgent,
    feasibilityAnalysisAgent,
    scopeDefinitionAgent,
    technologyRecommendationAgent,
    timelinePlanningAgent,
    riskAssessmentAgent,
    analyzeProjectContext
};