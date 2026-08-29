// ==========================================
// services/aiAgents.js (Granular Multi-Agent & Chat Engine)
// ==========================================
const { GoogleGenAI } = require("@google/genai");

// Initialize Google AI with local environment API key
const apiKey = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI(apiKey ? { apiKey } : {});
const MODEL_NAME = 'gemini-2.5-flash';

/**
 * 1. Feasibility Analysis Agent
 */
async function feasibilityAnalysisAgent(metadata) {
    const prompt = `
    You are the Feasibility & Risk Analysis Agent for an academic project platform.
    Analyze the following project parameters and return a highly detailed, comprehensive markdown report.

    PROJECT METADATA:
    Title: ${metadata.projectTitle}
    Description: ${metadata.projectDescription}
    Provided Tech Stack: ${metadata.techStack}
    Target Duration: ${metadata.duration}
    Team Size: ${metadata.teamSize}

    Include:
    1. ### 🛡️ Overall Feasibility Index (Score out of 100 with High/Medium/Low rating)
    2. ### 📊 Key Technical & Domain Strengths (3-5 granular points)
    3. ### ⚠️ Architectural, Resource & Data Risks (Identify 3 potential execution bottlenecks)
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
    const prompt = `
    You are the Scope Definition & Functional Specification Agent for an academic project platform.
    Generate a granular, detailed project scope and MVP feature specification in markdown format.

    PROJECT METADATA:
    Title: ${metadata.projectTitle}
    Description: ${metadata.projectDescription}
    Domain: ${metadata.projectDomain || 'Software Engineering'}

    Include:
    1. ### 🎯 Detailed Problem Statement & Target Audience Definition
    2. ### 🚀 Must-Have Core MVP Features (List 4 core specifications with technical details)
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
    const prompt = `
    You are the Architecture & Technology Recommendation Agent for an academic project platform.
    Analyze the project requirements and output an exhaustive tech stack specification in markdown format.

    PROJECT METADATA:
    Title: ${metadata.projectTitle}
    Description: ${metadata.projectDescription}
    Student Tech Background: ${metadata.techStack}

    Include:
    1. ### ⚙️ Recommended Frontend Framework & UI Stack (Framework, styling, state management)
    2. ### 🔧 Backend API & Runtime Environment (Framework, routing, async workers)
    3. ### 🗄️ Database & Storage Layer (Relational/NoSQL schema choice, indexing strategy)
    4. ### 🤖 AI / ML & Data Analytics Engine (Frameworks, pre-trained models, pipeline)
    5. ### ☁️ DevOps, CI/CD & Deployment Strategy (Hosting platform, containerization)
    6. ### 💡 Stack Trade-off Rationale (Why this combination over alternative heavy enterprise stacks)
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
    const duration = metadata.duration || '8 Weeks';
    const weeks = parseInt(duration) || 8;
    const weeklyHours = parseInt(metadata.weeklyHours) || 10;
    const teamSize = parseInt(metadata.teamSize) || 2;
    const totalStudentHours = weeks * weeklyHours;

    const prompt = `
    You are the Resource Timeline & Milestone Planning Agent for an academic project platform.
    Generate a complete, time-constrained week-by-week milestone roadmap in markdown table format.

    PROJECT METADATA:
    Title: ${metadata.projectTitle}
    Description: ${metadata.projectDescription}
    Target Duration: ${weeks} Weeks
    Weekly Available Hours per Student: ${weeklyHours} Hours/Week (Total Student Budget: ${totalStudentHours} Hours)
    Team Size: ${teamSize} Student(s)

    Incorporate the following 4 official project milestones:
    - **Milestone 1**: Study agentic workflows, multi-agent architecture design, student onboarding profile/skill assessment, and project submission interface.
    - **Milestone 2**: Feasibility Analysis Agent, Scope Definition Agent, Tech Stack Recommendation Agent, and Milestone Planning Agent.
    - **Milestone 3**: Risk Assessment & Mitigation Agent, Conversational Mentor interaction, Progress tracking, and On-demand documentation generation.
    - **Milestone 4**: Faculty Monitoring Dashboard, end-to-end testing, prompt optimization, and technical report & final defense prep.

    Output:
    1. ### ⏱️ Time Constraints & Effort Summary (Duration: ${weeks} Weeks | ${weeklyHours} Hours/Wk per student | Team Size: ${teamSize})
    2. ### 📅 Milestone Overview Matrix Table (Columns: Milestone & Weeks | Core Objectives | Detailed Technical Deliverables | Budgeted Student Hours)
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
    const prompt = `
    You are the Risk Assessment & Mitigation Agent for an academic project platform.
    Analyze the project parameters and generate an exhaustive technical risk matrix with actionable Plan-B fallbacks.

    PROJECT METADATA:
    Title: ${metadata.projectTitle}
    Description: ${metadata.projectDescription}
    Tech Stack: ${metadata.techStack}

    Include:
    1. ### 🛡️ Technical & Architecture Risks (Identify latency, database, and system integration bottlenecks)
    2. ### 📊 Dataset & Resource Dependency Risks (Data availability, hardware delivery delays, API rate limits)
    3. ### ⏰ Deadline & Scope Creep Risks (Time allocation risks)
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
 * Single-request Unified Multi-Agent Pipeline for Project Planning
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
 * Interactive AI Mentor Chat Service
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

// Rich Fallback Generators (Offline support if API key is missing/exceeded)
function generateFallbackFeasibility(meta) {
    return `### 🛡️ Feasibility & Risk Analysis Report
* **Overall Feasibility Rating**: **88/100 (HIGH ACADEMIC VIABILITY)**
* **Key Strengths**:
  * Clear project scope aligned with student skills (${meta.techStack || 'JavaScript/Python'}).
  * Manageable dataset and resource requirements within semester timeframe.
  * Direct practical utility and strong academic evaluation potential.
* **Architectural & Execution Risks**:
  * Risk 1: Integration latency between frontend UI and analytical backend APIs.
  * Risk 2: High time expenditure on unexpected third-party library syntax.
* **Complexity Metrics**:
  * Frontend UI: 70/100 | Backend API: 75/100 | Database Schema: 65/100 | AI/ML Pipeline: 70/100 | Overall Complexity: Moderate
* **💡 Mentor Insight**: Focus on completing Milestone 1 tasks early. Keep core features modular so testing remains stress-free!`;
}

function generateFallbackScope(meta) {
    return `### 🎯 Project Scope & Functional Specifications
* **Target Audience**: Academic evaluators, domain end-users, and project reviewers.
* **Must-Have Core MVP Features**:
  1. **User Authentication & Profile Control**: Role-based access and student settings.
  2. **Core Processing Engine**: Ingestion pipeline for ${meta.projectTitle || 'project logic'}.
  3. **Interactive Data Dashboard**: Real-time progress gauges, charts, and metrics.
  4. **Report Export Module**: One-click summary exports (PDF/JSON format).
* **Optional Stretch Features**:
  * Real-time WebSocket push notifications for instant alerts.
  * Multi-language UI localization (i18n).
* **Out-of-Scope Targets**:
  * High-concurrency enterprise cloud deployment (deferred to post-graduation).`;
}

function generateFallbackTech(meta) {
    return `### ⚙️ Recommended Technology Architecture
* **Frontend**: HTML5 + Modern CSS3 + JavaScript (Vite / React optional) for lightweight responsiveness.
* **Backend**: Node.js (Express) / Python (FastAPI/Flask) for high-performance RESTful routing.
* **Database & Storage**: Relational Schema (PostgreSQL / SQLite / MySQL) with query optimization.
* **AI & Analytics Engine**: Scikit-Learn / PyTorch / OpenCV pre-trained models.
* **DevOps & Hosting**: Containerized Render / Vercel cloud deployment.
* **💡 Stack Trade-off Rationale**: Avoids bloated enterprise frameworks, saving 2+ weeks of setup time so you can focus on building core deliverables.`;
}

function generateFallbackTimeline(meta) {
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

> ⏱️ **Entered Time Constraints**: **${weeks} Weeks Total** | **${weeklyHours} Hours/Week per student** | **Team Size: ${teamSize} Member(s)**  
> 📊 **Budgeted Effort**: **~${totalStudentHours} Hours per Student** (${totalTeamHours} Total Team Hours)

| Milestone & Schedule | Core Phase Objectives | Detailed Technical Deliverables & Task Checklist | Budgeted Hours |
| :--- | :--- | :--- | :--- |
| **Milestone 1** (W1-${Math.max(1, Math.round(weeks * 0.25))}) | Study & Architecture Setup | 1. Study agentic AI workflows & project mentoring methodologies.<br>2. Design multi-agent system architecture, agent roles, and student-project data models.<br>3. Develop student onboarding — profile creation & skill assessment functionality.<br>4. Implement project idea submission interface & trigger mechanism for agent pipeline. | ~${m1_hrs} Hours / student |
| **Milestone 2** (W${Math.max(1, Math.round(weeks * 0.25))+1}-${Math.round(weeks * 0.50)}) | Core Agent Pipeline Build | 1. Develop Feasibility Analysis Agent & Scope Definition Agent.<br>2. Implement Technology Stack Recommendation Agent with reasoning output.<br>3. Build Milestone & Timeline Planning Agent — generates week-wise execution plan.<br>4. Validate end-to-end pipeline using sample student project ideas. | ~${m2_hrs} Hours / student |
| **Milestone 3** (W${Math.round(weeks * 0.50)+1}-${Math.round(weeks * 0.75)}) | Risk, Mentor & Reports | 1. Develop Risk Assessment & Mitigation Agent — identifies blockers & suggests resolutions.<br>2. Implement conversational mentor interaction for ongoing weekly student check-ins.<br>3. Build progress tracking — student updates trigger plan adjustments via agent pipeline.<br>4. Develop on-demand documentation generation for synopsis, methodology, and progress reports. | ~${m3_hrs} Hours / student |
| **Milestone 4** (W${Math.round(weeks * 0.75)+1}-${weeks}) | Dashboard & Defense Prep | 1. Develop faculty monitoring dashboard — project health indicators & auto-generated mentor summaries.<br>2. Conduct end-to-end testing across all agents & interaction workflows.<br>3. Optimize agent prompt quality, response accuracy, and pipeline reliability.<br>4. Prepare technical documentation, project report, and final demonstration. | ~${m4_hrs} Hours / student |`;
}

function generateFallbackRisk(meta) {
    return `### 🛡️ Risk Assessment & Actionable Mitigation Plan

1. **High Model Inference Latency on Mobile / Client Devices**
   * **Blocker Identified**: Remote API calls or heavy models cause response delays > 1.5 seconds.
   * **Suggested Resolution / Mitigation**: Use compressed lightweight architectures (such as DistilBERT, MobileNet, or ONNX runtimes) with async API workers to maintain response times strictly under 500ms.

2. **Dataset Quality & Insufficient Training Samples**
   * **Blocker Identified**: Dataset scarcity for specialized student project domain.
   * **Suggested Resolution / Mitigation**: Leverage open-source benchmark datasets combined with data augmentation techniques (SMOTE, synthetic text sampling, or TF-IDF vectorization).

3. **Integration Overrun & Hardware Delivery Delays**
   * **Blocker Identified**: Unexpected third-party API syntax or delayed physical sensors.
   * **Suggested Resolution / Mitigation**: Pivot to simulated data streams via Python scripts to maintain software pipeline progress while keeping MVP scope modular.`;
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