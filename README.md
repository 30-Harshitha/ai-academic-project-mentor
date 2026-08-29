# 🎓 AI Academic Project Mentor Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-v18.0%2B-green.svg)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-v4.18-lightgrey.svg)](https://expressjs.com/)
[![MySQL](https://img.shields.io/badge/MySQL-v8.0-blue.svg)](https://www.mysql.com/)
[![Google Gemini API](https://img.shields.io/badge/AI Engine-Gemini 2.5 Flash-orange.svg)](https://aistudio.google.com/)
[![Build Status](https://img.shields.io/badge/Build-Passing-brightgreen.svg)]()

> **An Agentic AI Platform for End-to-End Academic Project Lifecycle Management, Multi-Agent Workflow Orchestration, and Passive Faculty Supervision.**

---

## 📋 Table of Contents
- [Executive Summary](#-executive-summary)
- [Key Platform Features & 8 Core Modules](#-key-platform-features--8-core-modules)
- [System Architecture & Multi-Agent Flow](#-system-architecture--multi-agent-flow)
- [Technology Stack](#-technology-stack)
- [Team Member Role Matrix](#-team-member-role-matrix)
- [Official Program Schedule (June 29 – August 20, 2026)](#-official-program-schedule-june-29--august-20-2026)
- [Getting Started & Local Installation](#-getting-started--local-installation)
- [Quality Assurance & Unit Test Verification](#-quality-assurance--unit-test-verification)
- [License & Copyright](#-license--copyright)

---

## 🌟 Executive Summary

The **AI Academic Project Mentor** platform bridges the guidance gap between student project aspirations and faculty supervision. By taking a 2-line project idea from a student, the system automatically triggers a **5-Agent Autonomous AI Pipeline** that evaluates feasibility, defines core MVP boundaries, recommends an optimized technology stack, generates an ~80-hour effort budget, and identifies execution risks with Plan-B fallbacks.

Furthermore, the platform equips academic advisors with a **Faculty Monitoring Dashboard (`faculty.html`)**, team health indicators (`+ On Track`, `⚠️ Needs Guidance`, `❌ At Risk`), an **Interactive Guidance Feedback Modal**, and live callout notification banners.

---

## 🛠️ Key Platform Features & 8 Core Modules

1. **Module 1: Student Profile & Skill Assessment Matrix (`assessment.html`)**: Evaluates technical competencies (0–100 score) to customize downstream agent outputs.
2. **Module 2: Project Idea Submission Desk (`submit-project.html`)**: Accepts 2-line raw student prompts or single-click selection of 4 pre-loaded academic template cards (Healthcare AI, E-Commerce, IoT Tracker, Agent Mentor).
3. **Module 3: Multi-Agent Control Hub (`agent-hub.html`)**: Orchestrates 5 autonomous AI agents with a real-time execution log terminal stream.
4. **Module 4: Feasibility & Scope Agent**: Evaluates viability index score (88%) and demarcates core Must-Have MVP features to prevent scope creep.
5. **Module 5: Tech Stack & Milestone Planning Agent**: Recommends stack choices (Node.js/Express/MySQL) with clear trade-offs and generates an ~80-hour effort roadmap.
6. **Module 6: Risk Assessment Agent**: Identifies API latency or dataset risks and deploys local DistilBERT fallback classifiers (<500ms latency) for 100% uptime.
7. **Module 7: Nova AI Mentor Chat Desk (`ai-mentor.html`)**: Provides 24/7 conversational mentoring with Quick Action Prompt Chips for instant technical answers.
8. **Module 8: Faculty Monitoring Dashboard (`faculty.html`)**: Features team health cards, AI progress digests, an Interactive Guidance Modal, and live student callout notification banners.

---

## ⚙️ System Architecture & Multi-Agent Flow

```
[ Student Prompt Input ]
           │
           ▼
┌────────────────────────────────────────────────────────┐
│         EXPRESS.JS UNIFIED AGENT CONTROLLER            │
│          (/api/projects/agent/unified)                 │
└──────────┬─────────────────────────────────────────────┘
           │
           ├────────► 1. Feasibility Agent (88% Viability Score)
           ├────────► 2. Scope Definition Agent (MVP Boundaries)
           ├────────► 3. Tech Stack Agent (Architecture Rationale)
           ├────────► 4. Timeline Agent (~80h Milestone Plan)
           └────────► 5. Risk Assessment Agent (Plan-B Mitigation)
           │
           ▼
┌────────────────────────────────────────────────────────┐
│              PERSISTENCE & RENDERING LAYER             │
│  • Client Terminal Window Logs Stream                  │
│  • MySQL Relational DB Schema (ai_project_mentor)      │
│  • HTML5 localStorage Session Context                  │
│  • Faculty Guidance Banner Transmission                │
└────────────────────────────────────────────────────────┘
```

---

## 💻 Technology Stack

| Component | Technology | Usage in Project |
| :--- | :--- | :--- |
| **Frontend UI** | HTML5, CSS3, JavaScript (ES6+) | Responsive views (`dashboard.html`, `faculty.html`, `profile.html`) |
| **UI Framework** | Bootstrap 5.3 | Responsive grid containers, alerts, and modal dialogs |
| **Backend Server** | Node.js & Express.js | Asynchronous REST API routing, middleware, and CORS |
| **AI Inference** | Google Gemini API (`gemini-2.5-flash`) | Deep reasoning for dynamic project blueprints |
| **Offline Fallbacks** | DistilBERT Local Classifiers | Sub-500ms offline fallback generator in `aiAgents.js` |
| **Database** | MySQL RDBMS | Schema (`ai_project_mentor`) with connection pooling (`db.js`) |
| **Authentication** | OAuth 2.0 (Google & GitHub) | Single-click social authentication (`handleSocialAuth`) |
| **Document Exporter**| Window Print API & `@media print` | Academic synopsis and defense slide PDF exports |

---

## 👥 Team Member Role Matrix

| Team Member | Project Role | Assignment Scope |
| :--- | :--- | :--- |
| **Harshitha H S** | **MAJOR ROLE / Project Lead** | System Architecture, Multi-Agent Controller (`aiAgents.js`), System Integration & Defense Lead. |
| **Vamshi Krishna** | Minor Role (Backend & Auth) | MySQL Schema, Express REST APIs (`/api/users`) & Google/GitHub OAuth Integration. |
| **Muthumenen M** | Minor Role (UI/UX) | Student Profile Onboarding (`register.html`), Skill Matrix (`assessment.html`) & Dashboard Layout. |
| **Lohith Raj** | Minor Role (Risk & Testing) | Risk Agent, Nova AI Chat Desk (`ai-mentor.html`) & Unit Test Verification (**100% PASS**). |
| **Harsh** | Minor Role (Faculty View) | Faculty Monitoring Dashboard (`faculty.html`), Guidance Modal & Document Exporter (`report-view.html`). |

---

## 📅 Official Program Schedule (June 29 – August 20, 2026)

- **Milestone 1 (Sprint 1: June 29 – July 10, 2026)**: System Data Flow Design, MySQL Schema, Onboarding UI & Submission Desk.
- **Milestone 2 (Sprint 2: July 13 – July 24, 2026)**: Feasibility Agent, Scope Agent, Tech Stack Agent, Timeline Agent & Control Hub UI.
- **Milestone 3 (Sprint 3: July 27 – August 07, 2026)**: Check-in Progress Engine, Risk Agent, Nova AI Chat Desk & PDF Document Exporter.
- **Milestone 4 (Sprint 4: August 10 – August 20, 2026)**: Faculty Monitoring Dashboard, Guidance Modal, OAuth Login & Final System QA.

---

## ⚡ Getting Started & Local Installation

### Prerequisites
- **Node.js**: `v18.0.0` or higher
- **MySQL Database**: `v8.0` or higher
- **Git**: Latest version

### Installation Steps

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/YOUR-USERNAME/AI-Academic-Project-Mentor.git
   cd AI-Academic-Project-Mentor
   ```

2. **Install Backend Dependencies**:
   ```bash
   cd client/backend
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in `client/backend/.env`:
   ```env
   PORT=5000
   GEMINI_API_KEY=your_google_gemini_api_key_here
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_mysql_password
   DB_NAME=ai_project_mentor
   ```

4. **Initialize MySQL Database**:
   Import `ai_project_mentor` schema into MySQL:
   ```bash
   mysql -u root -p < database_schema.sql
   ```

5. **Start the Backend Server**:
   ```bash
   npm start
   ```
   Open `http://localhost:5000` or launch `client/html/login.html` in your web browser!

---

## ✅ Quality Assurance & Unit Test Verification

- **Automated Unit Tests**: 7/7 Verified (**100% PASS**) covering Registration, Submission, 5-Agent Execution, Milestone Badge Shifting, Document PDF Generator, Faculty Feedback Banner, and OAuth Login.
- **Defect Tracker QA**: 7/7 Defects Resolved & **`Status: Closed`**.

---

## 📄 License & Copyright

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

*Copyright (c) 2026 Harshitha H S. All rights reserved.*
