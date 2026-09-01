// ==========================================
// services/aiAgents.js (100% Dynamic Multi-Agent Engine for Any Submitted Project)
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
 * Universal Dynamic Project Context Analyzer (Generates Custom Details for ANY Project Idea)
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

    // Extract key action verbs & noun phrases from submitted project text for deep customization
    const cleanTitle = title.replace(/[^a-zA-Z0-9\s]/g, "").trim();
    const shortDesc = desc.length > 80 ? desc.substring(0, 80) + "..." : desc;

    // Determine domain category dynamically
    let domain = "Software Engineering & Web Architecture";
    let category = "Full-Stack System";

    if (text.includes("health") || text.includes("medical") || text.includes("patient") || text.includes("doctor") || text.includes("disease") || text.includes("tumor") || text.includes("clinical")) {
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
    } else if (text.includes("security") || text.includes("cyber") || text.includes("detect") || text.includes("fraud") || text.includes("phishing") || text.includes("auth")) {
        domain = "Cybersecurity & Information Assurance";
        category = "Intelligent Threat Detection Engine";
    } else if (text.includes("nlp") || text.includes("chat") || text.includes("sentiment") || text.includes("bot") || text.includes("mentor")) {
        domain = "Conversational AI & Natural Language Processing";
        category = "Agentic Language Processing & Guidance Platform";
    } else if (text.includes("vision") || text.includes("image") || text.includes("video") || text.includes("opencv")) {
        domain = "Computer Vision & Visual Data Intelligence";
        category = "Automated Visual Analytics Engine";
    }

    // Dynamically build Must-Have MVP features tailored to submitted project title and description
    const mvpFeatures = [
        `User Profile Onboarding & Input Data Ingestion Interface tailored for "${cleanTitle}"`,
        `Core Business Logic & AI Data Processing Engine for processing: ${shortDesc}`,
        `Interactive Command Dashboard with Real-Time Progress Gauges & Visual Status Metrics for "${cleanTitle}"`,
        `Automated Summary Exporter & Academic Progress PDF/CSV Report Generator`
    ];

    const stretchFeatures = [
        `Third-Party REST API Webhook Integration for real-time external data syncing`,
        `Advanced AI Predictive Analytics & Sentiment / Risk Analytics Module for "${cleanTitle}"`,
        `Role-Based Access Control (Student, Team Lead, Faculty Advisor) with Multi-Factor Authentication`
    ];

    const techStack = {
        frontend: "React.js 18 / Modern HTML5 + Bootstrap 5 + Chart.js Visualization UI",
        backend: "Node.js (Express REST API) + Python FastAPI / Flask Asynchronous Workers",
        database: "MySQL Relational Database / PostgreSQL with ORM Connection Pool (db.js)",
        ai: "Google Gemini 2.5 Flash API + Scikit-Learn Machine Learning Models / DistilBERT Local Fallbacks",
        devops: "Docker Containerized Deployment on Render / Vercel Cloud Platform with SSL Security"
    };

    const risks = [
        `System Latency & API Rate Limits during real-time data processing for "${cleanTitle}"`,
        `Data Ingestion Format Mismatch & Sample Dataset Scarcity during initial model training`,
        `Scope Creep & Milestone Deliverable Integration Overrun near semester evaluation deadline`
    ];

    // Build 4 100% Project-Tailored Milestone Deliverables!
    const milestoneDetails = {
        m1: [
            `Conduct domain research and requirement analysis specifically for "${cleanTitle}".`,
            `Design relational database ERD tables (Users, Projects, Analytics, Logs) tailored to: "${shortDesc}".`,
            `Build student profile onboarding & project submission desk for "${cleanTitle}".`,
            `Set up project repository, environment configuration, and sample dataset ingestion pipeline.`
        ],
        m2: [
            `Develop core backend API endpoints (/api/projects, /api/users, /api/process) in Node.js/Express for "${cleanTitle}".`,
            `Implement AI analytics engine and data processing logic tailored to: "${shortDesc}".`,
            `Build frontend interactive user workspace cards & dashboard status metrics for "${cleanTitle}".`,
            `Execute Feasibility and Scope Agent validation scripts against submitted project metadata.`
        ],
        m3: [
            `Execute Risk Assessment Agent — resolve API latency and database query bottlenecks for "${cleanTitle}".`,
            `Integrate Nova AI Mentor chat desk for weekly student doubt resolution & check-in guidance.`,
            `Log Weekly Progress Check-ins & test automated report exporter (Synopsis, Methodologies).`,
            `Process faculty guidance notes and render live advisor callout banners.`
        ],
        m4: [
            `Launch Faculty Monitoring Dashboard with real-time student health digest badges for "${cleanTitle}".`,
            `Conduct comprehensive automated unit testing across all modules (UT-001 to UT-007 PASS).`,
            `Optimize API response speed (<300ms) and agent prompt accuracy.`,
            `Prepare final 25-slide defense presentation deck & technical report synopsis for "${cleanTitle}".`
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
    Milestone 3 (Risk & Mentor): ${ctx.milestoneDetails.m3.join(' ')}
    Milestone 4 (Dashboard & Defense): ${ctx.milestoneDetails.m4.join(' ')}
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

// Rich Fallback Generators tailored 100% to submitted project title and description

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
| **Milestone 2** (Week ${Math.max(1, Math.round(ctx.weeks * 0.25)) + 1}-${Math.round(ctx.weeks * 0.50)}) | Core Agent Pipeline Build | ${ctx.milestoneDetails.m2.join('<br>')} | ~${m2_hrs} Hours / student |
| **Milestone 3** (Week ${Math.round(ctx.weeks * 0.50) + 1}-${Math.round(ctx.weeks * 0.75)}) | Risk, Mentor & Progress | ${ctx.milestoneDetails.m3.join('<br>')} | ~${m3_hrs} Hours / student |
| **Milestone 4** (Week ${Math.round(ctx.weeks * 0.75) + 1}-${ctx.weeks}) | Dashboard & Defense Prep | ${ctx.milestoneDetails.m4.join('<br>')} | ~${m4_hrs} Hours / student |`;
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