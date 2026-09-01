// ==========================================
// services/aiAgents.js (100% Student Project-Focused Multi-Agent Engine)
// ==========================================
const { GoogleGenAI } = require("@google/genai");

// Initialize Google AI with local environment API key
const apiKey = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI(apiKey ? { apiKey } : {});
const MODEL_NAME = 'gemini-2.5-flash';

/**
 * Dynamic Feasibility Calculator
 */
function calculateDynamicFeasibilityScore(meta, text) {
    let score = 85; // Baseline standard score
    
    // Domain & Tech Complexity Adjustments
    if (text.includes("blockchain") || text.includes("quantum") || text.includes("robotics") || text.includes("satellite") || text.includes("crypto")) {
        score -= 14; // High-complexity hardware/crypto challenge (~71%)
    } else if (text.includes("e-commerce") || text.includes("ecommerce") || text.includes("crud") || text.includes("management") || text.includes("portal") || text.includes("catalog")) {
        score += 9; // Highly feasible web/mobile system (~94%)
    } else if (text.includes("upi") || text.includes("fraud") || text.includes("finance") || text.includes("payment") || text.includes("bank")) {
        score += 5; // Financial tech / Fraud detection system (~90%)
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
 * Universal Student Project Context Analyzer (Builds 100% Project-Specific Deliverables for ANY Idea)
 */
function analyzeProjectContext(meta) {
    const title = meta.projectTitle || (meta.projectDescription ? (meta.projectDescription.substring(0, 45) + "...") : "Academic Project");
    const desc = meta.projectDescription || meta.description || "Comprehensive academic project build.";
    const text = (title + " " + desc + " " + (meta.techStack || "")).toLowerCase();
    
    const { score: feasibilityScore, rating: feasibilityRating } = calculateDynamicFeasibilityScore(meta, text);

    const weeks = parseInt(meta.duration) || 8;
    const hrsPerWk = parseInt(meta.weeklyHours) || 10;
    const teamSize = parseInt(meta.teamSize) || 2;
    const totalStudentHours = weeks * hrsPerWk;
    const totalTeamHours = totalStudentHours * teamSize;

    const cleanTitle = title.replace(/[^a-zA-Z0-9\s]/g, "").trim();
    const shortDesc = desc.length > 80 ? desc.substring(0, 80) + "..." : desc;

    // Determine domain category dynamically
    let domain = "Software Engineering & Web Architecture";
    let category = "Full-Stack System";

    if (text.includes("upi") || text.includes("fraud") || text.includes("finance") || text.includes("bank") || text.includes("payment") || text.includes("credit card")) {
        domain = "FinTech & Automated Fraud Analytics";
        category = "Real-Time Transaction Risk Analysis & Fraud Detection System";
    } else if (text.includes("health") || text.includes("medical") || text.includes("patient") || text.includes("doctor") || text.includes("disease") || text.includes("tumor") || text.includes("diagnostic")) {
        domain = "Healthcare & Biomedical Intelligence";
        category = "Clinical Decision Support & Medical Intelligence";
    } else if (text.includes("e-commerce") || text.includes("ecommerce") || text.includes("shop") || text.includes("retail") || text.includes("product") || text.includes("cart") || text.includes("recommend")) {
        domain = "E-Commerce & Smart Retail Systems";
        category = "Intelligent Commerce & Personalization Platform";
    } else if (text.includes("blockchain") || text.includes("crypto") || text.includes("quantum")) {
        domain = "Blockchain & Distributed Ledger Security";
        category = "Decentralized Smart Contract Architecture";
    } else if (text.includes("iot") || text.includes("sensor") || text.includes("smart") || text.includes("agriculture") || text.includes("hardware") || text.includes("arduino") || text.includes("raspberry")) {
        domain = "IoT & Embedded Hardware Engineering";
        category = "Smart Telemetry & Hardware Control Platform";
    } else if (text.includes("security") || text.includes("cyber") || text.includes("detect") || text.includes("phishing") || text.includes("auth")) {
        domain = "Cybersecurity & Information Assurance";
        category = "Intelligent Threat Detection Engine";
    } else if (text.includes("nlp") || text.includes("chat") || text.includes("sentiment") || text.includes("bot")) {
        domain = "Conversational AI & Natural Language Processing";
        category = "Agentic Language Processing Platform";
    } else if (text.includes("vision") || text.includes("image") || text.includes("video") || text.includes("opencv")) {
        domain = "Computer Vision & Visual Data Intelligence";
        category = "Automated Visual Analytics Engine";
    }

    // Build Must-Have MVP features 100% focused on the submitted project itself
    const mvpFeatures = [
        `User Input & Data Ingestion Pipeline for "${cleanTitle}"`,
        `Core Analytics / ML Classifier Engine tailored to: ${shortDesc}`,
        `Interactive Control Dashboard with Real-Time Risk Gauges & Metrics for "${cleanTitle}"`,
        `Automated Summary Exporter & PDF/CSV Analytics Generator for "${cleanTitle}"`
    ];

    const stretchFeatures = [
        `Real-Time Webhook / Push Alert Notification Module for instant alerts`,
        `Advanced AI Predictive Scoring Engine for "${cleanTitle}"`,
        `Role-Based Access Control (User, Manager, Administrator) with Multi-Factor Authentication`
    ];

    const techStack = {
        frontend: "React.js 18 / Modern HTML5 + Bootstrap 5 + Chart.js Visualization Dashboard",
        backend: "Node.js (Express REST API) + Python FastAPI / Flask Data Processing Workers",
        database: "MySQL Relational Database / PostgreSQL with ORM Connection Pool",
        ai: "Scikit-Learn (XGBoost / Random Forest / Isolation Forest) / TensorFlow ML Models",
        devops: "Docker Containerized Deployment on Render / Vercel Cloud Platform with SSL Security"
    };

    const risks = [
        `System Latency & Processing Overhead during high-volume data analysis for "${cleanTitle}"`,
        `Sample Training Dataset Imbalance & Edge Case Ingestion Mismatch`,
        `Feature Integration Overrun near project deadline`
    ];

    // Build 4 100% Student Project-Focused Milestone Cards (No platform meta-tasks!)
    const milestoneDetails = {
        m1: [
            `Conduct domain research and literature survey on algorithms for "${cleanTitle}".`,
            `Design relational database schema (tables for users, transactions/logs, and alerts) for "${cleanTitle}".`,
            `Set up project repository, development environment, and sample training dataset ingestion.`,
            `Define REST API payload structures and data preprocessing pipeline for "${cleanTitle}".`
        ],
        m2: [
            `Develop core ML classifier / analytical processing engine (e.g. Random Forest / XGBoost) for "${cleanTitle}".`,
            `Build backend Node.js / Python REST API endpoints (/api/analyze, /api/transactions) for "${cleanTitle}".`,
            `Develop frontend interactive user interface & real-time metric visualization gauges.`,
            `Test initial model prediction accuracy and feature scoring against test data.`
        ],
        m3: [
            `Conduct system performance optimization — reduce API inference response time under 300ms for "${cleanTitle}".`,
            `Implement risk mitigations (handling missing data fields, API rate limits, edge case fallback rules).`,
            `Build automated analytics summary exporter & PDF report generation module for "${cleanTitle}".`,
            `Conduct system integration testing and stress testing under high-volume input.`
        ],
        m4: [
            `Conduct comprehensive end-to-end unit & integration testing (UT-001 to UT-007 PASS) for "${cleanTitle}".`,
            `Finalize user interface responsiveness, theme styling, and error callout handling.`,
            `Compile complete technical documentation, system architecture flowcharts, and project synopsis.`,
            `Prepare final 25-slide presentation defense deck and live demonstration for "${cleanTitle}".`
        ]
    };

    return { title, desc, domain, category, mvpFeatures, stretchFeatures, techStack, risks, feasibilityScore, feasibilityRating, weeks, hrsPerWk, teamSize, totalStudentHours, totalTeamHours, milestoneDetails };
}

/**
 * 1. Feasibility Analysis Agent
 */
async function feasibilityAnalysisAgent(metadata) {
    const ctx = analyzeProjectContext(metadata);
    const prompt = `
    You are the Feasibility & Risk Analysis Agent for an academic project platform.
    Analyze the following project parameters and return an EXHAUSTIVE, HIGHLY DETAILED, COMPREHENSIVE markdown report tailored SPECIFICALLY to this submitted project.

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
    Generate an EXHAUSTIVE, GRANULAR project scope and MVP feature specification in markdown format tailored SPECIFICALLY to this submitted project.

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
    Analyze the project requirements and output an EXHAUSTIVE tech stack specification in markdown format tailored SPECIFICALLY to this submitted project.

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

    CRITICAL DIRECTIVE: Every single task in Milestones 1, 2, 3, and 4 MUST be strictly about building "${ctx.title}". Do NOT include meta platform tasks like building AI agents or faculty dashboards. Focus 100% on the student project deliverables.

    PROJECT METADATA:
    Title: ${ctx.title}
    Description: ${ctx.desc}
    Domain: ${ctx.domain}
    Target Duration: ${ctx.weeks} Weeks
    Weekly Available Hours per Student: ${ctx.hrsPerWk} Hours/Week (Total Student Budget: ${ctx.totalStudentHours} Hours)
    Team Size: ${ctx.teamSize} Student(s)

    Output detailed tasks for 4 milestones tailored strictly to "${ctx.title}":
    Milestone 1 (Requirements & Setup): ${ctx.milestoneDetails.m1.join(' ')}
    Milestone 2 (Core Build): ${ctx.milestoneDetails.m2.join(' ')}
    Milestone 3 (Risk & Performance): ${ctx.milestoneDetails.m3.join(' ')}
    Milestone 4 (Testing & Defense): ${ctx.milestoneDetails.m4.join(' ')}
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
    Analyze the project parameters and generate an EXHAUSTIVE technical risk matrix with actionable Plan-B fallbacks tailored SPECIFICALLY to "${ctx.title}".

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

// Fallback Generators 100% focused on student project deliverables

function generateFallbackFeasibility(meta) {
    const ctx = analyzeProjectContext(meta);
    return `### 🛡️ Feasibility & Risk Analysis Report for "${ctx.title}"
* **Project Analyzed**: **"${ctx.title}"** (${ctx.domain})
* **Overall Feasibility Index**: **${ctx.feasibilityScore}/100 (${ctx.feasibilityRating})**
* **Key Technical & Domain Strengths**:
  * **Targeted Domain Alignment**: Fully aligns with core principles of **${ctx.domain}**.
  * **Scope Manageability**: Core MVP features can be built incrementally within the ${ctx.weeks}-week timeline.
  * **Resource & Tooling Availability**: Supported by robust open-source libraries and standard API protocols.
  * **Team Capability Match**: Balanced workload allocation (~${ctx.totalStudentHours} hours/student across ${ctx.teamSize} team members).
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
    return `### 🎯 Project Scope & Functional Specifications for "${ctx.title}"
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
    return `### ⚙️ Recommended Technology Architecture for "${ctx.title}"
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
| **Milestone 1** (Week 1-${Math.max(1, Math.round(ctx.weeks * 0.25))}) | Requirements & Setup | ${ctx.milestoneDetails.m1.join('<br>')} | ~${m1_hrs} Hours / student |
| **Milestone 2** (Week ${Math.max(1, Math.round(ctx.weeks * 0.25)) + 1}-${Math.round(ctx.weeks * 0.50)}) | Core ML & API Build | ${ctx.milestoneDetails.m2.join('<br>')} | ~${m2_hrs} Hours / student |
| **Milestone 3** (Week ${Math.round(ctx.weeks * 0.50) + 1}-${Math.round(ctx.weeks * 0.75)}) | Integration & Optimization | ${ctx.milestoneDetails.m3.join('<br>')} | ~${m3_hrs} Hours / student |
| **Milestone 4** (Week ${Math.round(ctx.weeks * 0.75) + 1}-${ctx.weeks}) | Testing & Final Defense Prep | ${ctx.milestoneDetails.m4.join('<br>')} | ~${m4_hrs} Hours / student |`;
}

function generateFallbackRisk(meta) {
    const ctx = analyzeProjectContext(meta);
    return `### 🛡️ Risk Assessment & Actionable Mitigation Plan for "${ctx.title}"
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