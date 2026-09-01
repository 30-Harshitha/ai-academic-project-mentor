// ==========================================
// services/aiAgents.js (Dynamic Multi-Agent & Dynamic Feasibility Scoring)
// ==========================================
const { GoogleGenAI } = require("@google/genai");

// Initialize Google AI with local environment API key
const apiKey = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI(apiKey ? { apiKey } : {});
const MODEL_NAME = 'gemini-2.5-flash';

/**
 * Dynamic Feasibility Calculator Engine
 */
function calculateDynamicFeasibilityScore(meta, text) {
    let score = 84; // Baseline standard score
    
    // Domain & Tech Complexity Adjustments
    if (text.includes("blockchain") || text.includes("quantum") || text.includes("robotics") || text.includes("satellite") || text.includes("crypto")) {
        score -= 14; // High-complexity hardware/crypto challenge (e.g., ~70%)
    } else if (text.includes("e-commerce") || text.includes("ecommerce") || text.includes("crud") || text.includes("management") || text.includes("portal") || text.includes("catalog")) {
        score += 8; // Highly feasible web/mobile system (e.g., ~92%)
    } else if (text.includes("health") || text.includes("medical") || text.includes("iot") || text.includes("sensor")) {
        score += 4; // Moderate-high feasibility (e.g., ~88%)
    } else if (text.includes("ai") || text.includes("nlp") || text.includes("vision") || text.includes("detect")) {
        score += 2; // AI/ML project with manageable scope (e.g., ~86%)
    }

    // Team Size Adjustments
    const teamSize = parseInt(meta.teamSize) || 2;
    if (teamSize >= 4) score += 4;
    else if (teamSize === 3) score += 2;
    else if (teamSize === 1) score -= 6; // Single-student project penalizes buffer time

    // Duration Adjustments
    const weeks = parseInt(meta.duration) || 8;
    if (weeks >= 12) score += 4;
    else if (weeks >= 8) score += 1;
    else if (weeks <= 4) score -= 8; // Very short timeline increases execution risk

    // Clamp score strictly between 62% and 96%
    score = Math.max(62, Math.min(96, score));
    
    let rating = "HIGH ACADEMIC VIABILITY";
    if (score < 75) rating = "MODERATE VIABILITY (Requires Scope Trimming)";
    else if (score >= 91) rating = "EXCEPTIONAL ACADEMIC VIABILITY";

    return { score, rating };
}

/**
 * Domain Analyzer for Dynamic Multi-Agent Generation
 */
function analyzeProjectContext(meta) {
    const title = meta.projectTitle || (meta.projectDescription ? (meta.projectDescription.substring(0, 50) + "...") : "Academic Project");
    const desc = meta.projectDescription || meta.description || "Comprehensive academic project build.";
    const text = (title + " " + desc + " " + (meta.techStack || "")).toLowerCase();
    
    // Dynamic Feasibility Calculation
    const { score: feasibilityScore, rating: feasibilityRating } = calculateDynamicFeasibilityScore(meta, text);

    let domain = "Software Engineering & Web Architecture";
    let category = "Full-Stack System";
    let mvpFeatures = [];
    let stretchFeatures = [];
    let techStack = {};
    let risks = [];

    if (text.includes("health") || text.includes("medical") || text.includes("patient") || text.includes("doctor") || text.includes("disease") || text.includes("tumor") || text.includes("clinical")) {
        domain = "Healthcare & Biomedical Intelligence";
        category = "Medical AI & Clinical Decision Support";
        mvpFeatures = [
            "Patient Profile & Diagnostic Data Ingestion Portal",
            "Real-Time Health Metric & Medical Imaging Analysis Engine",
            "Risk Scoring & Predictive Diagnostic Alerts Module",
            "Secure HIPAA-Compliant Medical Summary & PDF Report Exporter"
        ];
        stretchFeatures = [
            "Integration with DICOM Medical Image Viewer APIs",
            "Telemedicine Video Consult Scheduling Integration",
            "Automated Multi-lingual Patient Advisory Assistant"
        ];
        techStack = {
            frontend: "React.js / HTML5 + Chart.js for Medical Telemetry",
            backend: "Node.js (Express) with DICOM / Health Data Parsers",
            database: "PostgreSQL / MySQL with Encrypted Medical Records Schema",
            ai: "PyTorch / TensorFlow Medical Classifier & Scikit-Learn Risk Models",
            devops: "Docker Containerized Deployment on Render / AWS Medical Sandbox"
        };
        risks = [
            "Medical Data Privacy & HIPAA Compliance Regulation Standards",
            "Model Inference Latency on Complex High-Resolution Imaging Datasets",
            "Scarcity of Anonymized Clinical Datasets for Model Training"
        ];
    } else if (text.includes("e-commerce") || text.includes("ecommerce") || text.includes("shop") || text.includes("retail") || text.includes("product") || text.includes("cart") || text.includes("recommend")) {
        domain = "E-Commerce & Intelligent Retail Systems";
        category = "Smart Commerce & Personalization Platform";
        mvpFeatures = [
            "Dynamic Product Catalog & Category Inventory Management",
            "AI Collaborative Filtering Product Recommendation Engine",
            "Interactive Shopping Cart & Stripe / PayPal Checkout Pipeline",
            "User Order Tracking & Purchase History Analytics Dashboard"
        ];
        stretchFeatures = [
            "AR Product 3D Preview Plugin for Mobile Browsers",
            "Automated Dynamic Pricing & Inventory Stock Alerts",
            "Multi-Currency & Regional Tax Calculator Middleware"
        ];
        techStack = {
            frontend: "React.js / HTML5 + Redux Toolkit for Shopping Cart State",
            backend: "Node.js (Express) REST API + Stripe Payment Webhooks",
            database: "MySQL / PostgreSQL (Products & Orders) + Redis Session Cache",
            ai: "Scikit-Learn Collaborative Filtering & Content-Based Recommenders",
            devops: "Vercel / Heroku Cloud Hosting with CDN Asset Caching"
        };
        risks = [
            "Cart State Synchronization Errors During High Traffic Bursts",
            "Cold-Start Problem for Newly Added Products in Recommendation Models",
            "Third-Party Payment Gateway Webhook Latency & Timeout Risks"
        ];
    } else if (text.includes("blockchain") || text.includes("quantum") || text.includes("crypto")) {
        domain = "Blockchain & Distributed Ledger Security";
        category = "Decentralized Smart Contract Architecture";
        mvpFeatures = [
            "Decentralized User Wallet Authentication & Identity Verification",
            "Solidity Smart Contract Execution & Immutable Ledger Audit Engine",
            "Transaction Gas Fee Calculator & Receipt Generation Module",
            "Decentralized File Storage Integration (IPFS)"
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
    } else if (text.includes("iot") || text.includes("sensor") || text.includes("smart") || text.includes("agriculture") || text.includes("hardware") || text.includes("arduino") || text.includes("raspberry")) {
        domain = "IoT & Embedded Hardware Engineering";
        category = "Smart Telemetry & Hardware Control Platform";
        mvpFeatures = [
            "Hardware Sensor Data Ingestion Gateway (MQTT / HTTP)",
            "Real-Time Telemetry Graph Dashboard & Threshold Alert Engine",
            "Automated Actuator / Relay Remote Switch Controller",
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
    } else if (text.includes("security") || text.includes("cyber") || text.includes("detect") || text.includes("fraud") || text.includes("phishing") || text.includes("auth")) {
        domain = "Cybersecurity & Information Assurance";
        category = "Intelligent Threat Detection & Security Engine";
        mvpFeatures = [
            "Network Traffic / Log File Security Ingestion Pipeline",
            "AI Anomaly & Intrusion Detection Classification Engine",
            "OAuth 2.0 & Multi-Factor User Authentication Access Control",
            "Incident Alert Manager & Threat Mitigation Audit Report Generator"
        ];
        stretchFeatures = [
            "Automated IP Blacklisting & Firewall Rule Trigger",
            "Blockchain-Based Tamper-Proof Audit Log Verification",
            "Dark Web Vulnerability Intelligence Feed Aggregator"
        ];
        techStack = {
            frontend: "React.js / HTML5 Dashboard with Incident Priority Callouts",
            backend: "Node.js (Express) / Python FastAPI Security Middleware",
            database: "PostgreSQL with Encrypted Column Extensions",
            ai: "Scikit-Learn Random Forest / XGBoost Threat Classifiers",
            devops: "Docker Hardened Container with SSL/TLS Encryption"
        };
        risks = [
            "High Rate of False Positives Flagging Legitimate User Requests",
            "Processing Overhead when Parsing High-Volume Network Packet Logs",
            "Model Evasion Attacks via Adversarial Security Prompts"
        ];
    } else {
        domain = "Full-Stack Software Engineering & Web Architecture";
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
            frontend: "HTML5 + Modern CSS3 + Vanilla JavaScript (ES6+)",
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
    }

    return { title, desc, domain, category, mvpFeatures, stretchFeatures, techStack, risks, feasibilityScore, feasibilityRating };
}

/**
 * 1. Feasibility Analysis Agent
 */
async function feasibilityAnalysisAgent(metadata) {
    const ctx = analyzeProjectContext(metadata);
    const prompt = `
    You are the Feasibility & Risk Analysis Agent for an academic project platform.
    Analyze the following project parameters and return a highly detailed, comprehensive markdown report tailored SPECIFICALLY to this submitted project.

    CRITICAL INSTRUCTION: Calculate a dynamic Feasibility Index Score (out of 100) specifically for "${ctx.title}" based on technical complexity, team size (${metadata.teamSize}), target duration (${metadata.duration}), and domain (${ctx.domain}). Do NOT use a hardcoded score.

    PROJECT METADATA:
    Title: ${ctx.title}
    Description: ${ctx.desc}
    Domain: ${ctx.domain}
    Provided Tech Stack: ${metadata.techStack || 'HTML, CSS, JS, Node.js, MySQL'}
    Target Duration: ${metadata.duration || '8 Weeks'}
    Team Size: ${metadata.teamSize || '2'}

    Include:
    1. ### 🛡️ Overall Feasibility Index (Numerical Score out of 100 with Rating for "${ctx.title}")
    2. ### 📊 Key Technical & Domain Strengths (3-5 granular points specific to ${ctx.domain})
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
    const duration = metadata.duration || '8 Weeks';
    const weeks = parseInt(duration) || 8;
    const weeklyHours = parseInt(metadata.weeklyHours) || 10;
    const teamSize = parseInt(metadata.teamSize) || 2;
    const totalStudentHours = weeks * weeklyHours;

    const prompt = `
    You are the Resource Timeline & Milestone Planning Agent for an academic project platform.
    Generate a complete, time-constrained week-by-week milestone roadmap in markdown table format tailored SPECIFICALLY to "${ctx.title}".

    PROJECT METADATA:
    Title: ${ctx.title}
    Description: ${ctx.desc}
    Domain: ${ctx.domain}
    Target Duration: ${weeks} Weeks
    Weekly Available Hours per Student: ${weeklyHours} Hours/Week (Total Student Budget: ${totalStudentHours} Hours)
    Team Size: ${teamSize} Student(s)

    Incorporate the following 4 official project milestones tailored to "${ctx.title}":
    - **Milestone 1**: Study domain architecture, system design, student onboarding profile/skill assessment, and submission desk for "${ctx.title}".
    - **Milestone 2**: Feasibility Analysis Agent, Scope Definition Agent, Tech Stack Recommendation Agent, and Milestone Planning Agent execution.
    - **Milestone 3**: Risk Assessment Agent, Nova AI mentor interaction, weekly check-in progress engine, and dynamic document exporter.
    - **Milestone 4**: Faculty Monitoring Dashboard, guidance feedback modal, end-to-end unit testing (UT-001 to UT-007 PASS), and final defense prep.

    Output:
    1. ### ⏱️ Time Constraints & Effort Summary (Duration: ${weeks} Weeks | ${weeklyHours} Hours/Wk per student | Team Size: ${teamSize})
    2. ### 📅 Milestone Overview Matrix Table (Columns: Milestone & Weeks | Core Objectives | Detailed Technical Deliverables for "${ctx.title}" | Budgeted Student Hours)
    3. ### 💡 Timeline Execution Rationale & Weekly Pace Recommendations
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

// Dynamic Project-Specific Fallback Generators with DYNAMIC FEASIBILITY SCORE

function generateFallbackFeasibility(meta) {
    const ctx = analyzeProjectContext(meta);
    return `### 🛡️ Feasibility & Risk Analysis Report
* **Project Analyzed**: **"${ctx.title}"** (${ctx.domain})
* **Overall Feasibility Index**: **${ctx.feasibilityScore}/100 (${ctx.feasibilityRating})**
* **Key Technical & Domain Strengths**:
  * **Targeted Domain Alignment**: Aligns with core principles of **${ctx.domain}**.
  * **Scope Manageability**: Detailed features can be built incrementally within semester limits.
  * **Resource & Tooling Availability**: Supported by open-source libraries and standard API standards.
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
  1. **${ctx.mvpFeatures[0]}**: Core user interface and ingestion pipeline.
  2. **${ctx.mvpFeatures[1]}**: Data processing and analytical engine.
  3. **${ctx.mvpFeatures[2]}**: Real-time status scoring, alerts, and dashboard.
  4. **${ctx.mvpFeatures[3]}**: Structured report exporter and summary views.
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
    const duration = meta.duration || '8 Weeks';
    const weeks = parseInt(duration) || 8;
    const weeklyHours = parseInt(meta.weeklyHours) || 10;
    const teamSize = parseInt(meta.teamSize) || 2;
    const totalStudentHours = weeks * weeklyHours;
    const totalTeamHours = totalStudentHours * teamSize;

    const m1_hrs = Math.round(totalStudentHours * 0.25);
    const m2_hrs = Math.round(totalStudentHours * 0.25);
    const m3_hrs = Math.round(totalStudentHours * 0.25);
    const m4_hrs = Math.round(totalStudentHours * 0.25);

    return `### 📅 Time-Constrained Milestone & Timeline Roadmap

> 📌 **Project**: **"${ctx.title}"** (${ctx.domain})  
> ⏱️ **Time Constraints**: **${weeks} Weeks Total** | **${weeklyHours} Hours/Week per student** | **Team Size: ${teamSize} Member(s)**  
> 📊 **Budgeted Effort**: **~${totalStudentHours} Hours per Student** (${totalTeamHours} Total Team Hours)

| Milestone & Schedule | Core Phase Objectives | Detailed Technical Deliverables for "${ctx.title}" | Budgeted Hours |
| :--- | :--- | :--- | :--- |
| **Milestone 1** (W1-${Math.max(1, Math.round(weeks * 0.25))}) | Study & Architecture Setup | 1. Study domain architecture for ${ctx.domain}.<br>2. Design system data flow and user schema.<br>3. Develop student profile onboarding & skill assessment.<br>4. Build project submission desk for "${ctx.title}". | ~${m1_hrs} Hours / student |
| **Milestone 2** (W${Math.max(1, Math.round(weeks * 0.25))+1}-${Math.round(weeks * 0.50)}) | Core Agent Blueprint Execution | 1. Feasibility Analysis Agent execution for "${ctx.title}".<br>2. Scope Agent MVP specification (${ctx.mvpFeatures[0]}).<br>3. Tech Stack Agent rationale (${ctx.techStack.backend}).<br>4. Timeline Planning Agent milestone matrix generation. | ~${m2_hrs} Hours / student |
| **Milestone 3** (W${Math.round(weeks * 0.50)+1}-${Math.round(weeks * 0.75)}) | Risk, Mentor & Reports | 1. Risk Assessment Agent — mitigate ${ctx.risks[0]}.<br>2. Conversational Nova AI mentor interaction.<br>3. Weekly progress check-in engine.<br>4. On-demand documentation exporter (Synopsis, Methodologies). | ~${m3_hrs} Hours / student |
| **Milestone 4** (W${Math.round(weeks * 0.75)+1}-${weeks}) | Dashboard & Defense Prep | 1. Faculty Monitoring Dashboard & Feedback Modal.<br>2. Conduct end-to-end system testing (UT-001 to UT-007 PASS).<br>3. Optimize agent prompt quality and response accuracy.<br>4. Prepare technical report and final presentation defense. | ~${m4_hrs} Hours / student |`;
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
    riskAssessmentAgent
};