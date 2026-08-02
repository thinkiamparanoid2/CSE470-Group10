# 🏗️ Smarstruction - Project Master Roadmap & Progress Tracker

> **CSE470 Group 10** | Smart Construction Management Platform in Bangladesh
> **Tech Stack:** Node.js + Express.js + Raw MySQL (`mysql2`) + EJS Templating + Glassmorphism CSS

---

## 🛑 STRICT UNIVERSITY CONSTRAINTS (CRITICAL)

1. **NO ORMs ALLOWED**: Every database operation MUST use raw SQL queries via `mysql2/promise` (`db.query('SELECT ...')`). Never use Eloquent, Sequelize, Prisma, or any ORM.
2. **NO DJANGO / NO FLASK**: Backend must remain Node.js + Express.
3. **NO MERN / NO REACT**: Built as a clean Monolith using server-side rendered **EJS** templates to prevent version mismatches and complex deployments.
4. **5 FEATURES PER MEMBER**: 4 Team Members (A, B, C, D) = 20 distinct features divided across 4 Sprints (excluding Login/Signup).

---

## 👥 TEAM ROLES & FEATURE ASSIGNMENT

### 👤 MEMBER A: Materials & Inventory
1. [x] **Material Stock Tracking** *(Sprint 1 - COMPLETED)*
2. [x] **Purchase Order System** *(Sprint 2)*
3. [x] **Site-wise Inventory Transfer** *(Sprint 2)*
4. [x] **Material Waste Log** *(Sprint 3)*
5. [ ] **Bill of Quantities (BOQ) Generator** *(Sprint 4)*

### 👤 MEMBER B: Vendors & Financials
1. [x] **Vendor Directory & Rating** *(Sprint 1 - COMPLETED)*
2. [x] **Delivery Scheduling** *(Sprint 2)*
3. [x] **Price Comparison Engine** *(Sprint 3)*
4. [x] **Contract Document Upload** *(Sprint 4)*
5. [ ] **Vendor Payment Tracker** *(Sprint 4)*

### 👤 MEMBER C: Projects, Labor & Milestones
1. [x] **Milestone Tracker** *(Sprint 1 - COMPLETED)*
2. [x] **Labor Attendance & Cost Log** *(Sprint 2)*
3. [x] **Project Progress Dashboard (Gantt-lite)** *(Sprint 3)*
4. [ ] **Project Expense Report Export** *(Sprint 4)*
5. [ ] **Daily Site Report** *(Sprint 4)*

### 👤 MEMBER D: System Admin, RBAC & Notices
1. [x] **Role-Based Access Control (RBAC)** *(Sprint 1 - COMPLETED)*
2. [x] **CMS for Company Homepage & Notice Board** *(Sprint 1 - COMPLETED)*
3. [x] **Notice / Announcement Board** *(Sprint 2)*
4. [x] **Emergency Material Request (Flagged Priority)** *(Sprint 3)*
5. [ ] **Equipment Maintenance Scheduler** *(Sprint 4)*

---

## 📅 SPRINT TIMELINE & STATUS

### 🟩 SPRINT 1: Foundation & Baseline Setup (COMPLETED)
- **Deadline:** July 20, 2026
- **Status:** ✅ COMPLETED & MERGED TO `main`
- **Features Implemented:**
  - RBAC & Session Auth (`middleware/auth.js`, `routes/auth.js`)
  - CMS Homepage & Public Notices (`views/home.ejs`, `routes/index.js`)
  - Material Stock Tracking (`views/materials/`, `routes/materials.js`)
  - Vendor Directory (`views/vendors/`, `routes/vendors.js`)
  - Milestone Tracker (`views/milestones/`, `routes/milestones.js`)

---

### 🟨 SPRINT 2: Core Operations & Logistical Workflows (COMPLETED)
- **Deadline:** August 2, 2026
- **Status:** ✅ COMPLETED & MERGED TO `main`
- **Goal:** Build the day-to-day transactional engine of the platform.
- **Features to Build:**
  1. **Purchase Order System** *(Member A)*: PMs generate purchase orders mapping to specific vendors and material catalogs.
  2. **Delivery Scheduling** *(Member B)*: Track expected material shipments from vendors on-site.
  3. **Labor Attendance & Cost Log** *(Member C)*: Log daily workforce headcount on-site and calculate daily labor costs.
  4. **Site-wise Inventory Transfer** *(Member A)*: Request and track material moves from one ongoing construction site to another.
  5. **Internal Notice Board** *(Member D)*: Company-wide updates and urgent site bulletins.

---

### 🟦 SPRINT 3: Advanced Optimization & Urgent Workflows
- **Deadline:** August 14, 2026
- **Status:** ✅ COMPLETED & MERGED
- **Features to Build:**
  1. [x] Project Progress Dashboard (Gantt-lite) *(Member C)*
  2. [x] Price Comparison Engine *(Member B)*
  3. [x] Emergency Material Request (Flagged priority) *(Member D)*
  4. [x] Material Waste Log *(Member A)*
  5. [x] Contract Document Upload *(Member B)*

---

### 🟪 SPRINT 4: Reporting, Financials & Polish
- **Deadline:** August 26, 2026
- **Status:** ⏳ PENDING
- **Features to Build:**
  1. Bill of Quantities (BOQ) Generator *(Member A)*
  2. Project Expense Report Export *(Member C)*
  3. Daily Site Report *(Member C)*
  4. Vendor Payment Tracker *(Member B)*
  5. Equipment Maintenance Scheduler *(Member D)*

---

## 🤖 AI ASSISTANT SESSION INSTRUCTIONS

> **Note for AI Coding Assistant:**
> When starting a new session or implementing a feature:
> 1. Read this `PROJECT_ROADMAP.md` file first to understand context and constraints.
> 2. Ensure all database interactions strictly use **RAW SQL** (`db.query('SELECT ...')` or `db.execute()`).
> 3. After completing a feature or sprint, update the checklist `[x]` and log your progress under the **Recent Activity Log** below.

### 📝 Recent Activity Log
- **2026-07-29**: Completed Sprint 3. Added Gantt-lite Dashboard, Price Comparison Engine, Emergency Material Requests, Material Waste Log, and Contract Uploads.
- **2026-07-29**: Completed Sprint 2. Added Purchase Order System, Delivery Scheduling, Labor Attendance & Cost Log, Site-wise Inventory Transfer, and Internal Notice Board. Updated database schema and integrated modules via Raw SQL.
- **2026-07-29**: Completed Sprint 1 baseline setup. Created database schema, authentication, RBAC, Material tracking, Vendor directory, Milestone tracker, and CMS homepage. Merged clean Node.js codebase to `main` branch.
