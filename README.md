# AI Academic Project Mentor Platform

> An Agentic AI Platform for End-to-End Academic Project Lifecycle Management, Multi-Agent Workflow Orchestration, and Passive Faculty Supervision.

---

## 🌟 Executive Summary

The **AI Academic Project Mentor** platform bridges the guidance gap between student project aspirations and faculty supervision. By taking a 2-line project idea from a student, the system automatically triggers a **5-Agent Autonomous AI Pipeline** that evaluates feasibility, defines core MVP boundaries, recommends an optimized technology stack, generates an ~80-hour effort budget, and identifies execution risks with Plan-B fallbacks.

Furthermore, the platform equips academic advisors with a **Faculty Monitoring Dashboard (`faculty.html`)**, team health indicators (`+ On Track`, `⚠️ Needs Guidance`, `❌ At Risk`), an **Interactive Guidance Feedback Modal**, and live callout notification banners.

---

## 🛠️ Technology Stack

- **Frontend**: HTML5, CSS3 Grid/Flexbox, Vanilla JavaScript (ES6+), Bootstrap 5.3, Marked.js
- **Backend**: Node.js, Express.js REST API framework, Multer, CORS
- **AI Engine**: 5 Autonomous AI Agents (Feasibility, Scope, Stack, Timeline, Risk), Google Gemini API (`gemini-2.5-flash`), DistilBERT Local Fallback Classifiers (<500ms latency)
- **Database**: MySQL Relational Database (`ai_project_mentor`), Node.js `mysql2` connection pooling (`db.js`), HTML5 `localStorage` API
- **Security**: Google OAuth 2.0 & GitHub OAuth Single-Click Authentication (`handleSocialAuth`)
- **Documentation**: Window Print-to-PDF Engine, Python `python-pptx` presentation generator

---

## 👥 Team Roles & Responsibility Matrix

| Team Member | Project Role | Responsibility Scope |
| :--- | :--- | :--- |
| **Harshitha H S** | **MAJOR ROLE / Project Lead** | System Architecture, Multi-Agent Pipeline Controller (`aiAgents.js`), Integration & Final Defense Lead. |
| **Vamshi Krishna** | Minor Role (Backend & Auth) | MySQL Database Schema, Express REST APIs & Google/GitHub OAuth Integration. |
| **Muthumenen M** | Minor Role (UI/UX) | Student Profile Onboarding, Skill Assessment Matrix (0-100 Score) & Command Dashboard Layout. |
| **Lohith Raj** | Minor Role (Risk & Mentoring) | Risk Assessment Agent, Nova AI Chat Desk (`ai-mentor.html`) & Unit Testing Verification (100% PASS). |
| **Harsh** | Minor Role (Faculty View) | Faculty Monitoring Dashboard (`faculty.html`), Interactive Feedback Modal & Document Exporter. |

---

## 📁 Repository Structure

```
├── client/
│   ├── backend/
│   │   ├── routes/          # Express REST API Routes (projects.js, users.js)
│   │   ├── services/        # 5-Agent Autonomous AI Engine (aiAgents.js)
│   │   └── db.js            # MySQL Connection Pool
│   ├── css/                 # Custom CSS stylesheets (style.css, dashboard.css)
│   ├── html/                # Frontend Web Views
│   │   ├── dashboard.html   # Student Command Dashboard & KPI Cards
│   │   ├── agent-hub.html   # 5-Agent Pipeline Execution Terminal
│   │   ├── ai-mentor.html    # Nova AI Chat Desk & Prompt Chips
│   │   ├── faculty.html     # Faculty Monitoring & Guidance Modal
│   │   ├── profile.html     # Student Profile & Resume Upload
│   │   ├── report-view.html # On-Demand PDF Document Exporter
│   │   └── submit-project.html # Idea Submission & Template Cards
│   └── js/                  # Frontend Client Scripts
├── Agile_Template_v0.1.xlsx # Product & Sprint Backlogs (June 29 – Aug 20, 2026)
├── Defect_Tracker Template_v0.1.xlsx # Defect QA Logs (7 Defects Closed)
├── Unit_Test_Plan_v0.1.xlsx # Unit Test Verification Plan (UT-001 to UT-007 PASS)
├── LICENSE                  # Official MIT Open-Source License
├── README.md                # Project Overview & Architecture Guide
└── package.json             # Node.js project manifest
```

---

## 📅 Official Program Schedule & Milestones (June 29 – August 20, 2026)

- **Milestone 1 (Sprint 1: June 29 – July 10, 2026)**: System Architecture, MySQL DB Setup, Onboarding UI & Idea Submission.
- **Milestone 2 (Sprint 2: July 13 – July 24, 2026)**: Feasibility Agent, Scope Agent, Tech Stack Agent, Milestone Agent & Control Hub UI.
- **Milestone 3 (Sprint 3: July 27 – August 07, 2026)**: Check-in Engine, Risk Agent, Nova AI Chat Desk & Document Exporter.
- **Milestone 4 (Sprint 4: August 10 – August 20, 2026)**: Faculty Dashboard, Interactive Feedback Modal, OAuth Login & Final System Testing.

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

*Copyright (c) 2026 Harshitha H S. All rights reserved.*
