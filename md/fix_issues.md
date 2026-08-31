# 🛠️ Fixes & Issue Resolution Report (fix_issues.md)

**Project:** SmartConstruct BD (SmartConstruction) — CSE470 Group 10  
**Date:** August 25, 2026  
**Tech Stack:** Node.js + Express.js + Raw MySQL (`mysql2/promise`) + EJS + Custom Glassmorphism CSS  

---

## 📌 Executive Summary

During the line-by-line codebase audit across **22 route files, 49 views, and 21 database tables**, all 20 required features across Sprints 1 to 4 were found to be present in code. However, several **critical structural violations, security vulnerabilities, missing CRUD operations, and environment setup gaps** were identified. 

This document details:
1. **What was wrong in the initial codebase.**
2. **What was changed, refactored, and fixed.**

---

## 🚨 1. Identified Issues (What Was Wrong)

### 1.1. Violation of Strict MVC Architecture
* **Issue:** The project instructions explicitly mandate a clean **Model-View-Controller (MVC)** design pattern. In the initial codebase, there was **no `controllers/` directory**.
* **Impact:** All database queries, transaction management, response rendering, and business logic were tightly coupled inside the `routes/` files (making files up to 200+ lines long), violating the course requirements.

### 1.2. Critical Authentication Backdoor (Security Vulnerability)
* **Issue:** In `routes/auth.js` (line 23), a hardcoded password bypass existed:
  ```javascript
  if (match || password === 'admin123') { ... }
  ```
* **Impact:** Any user could log in to ANY account (including SuperAdmin and Project Manager) using `admin123` even if the user changed their password or had a different hash in the database, completely bypassing bcrypt validation.

### 1.3. Incomplete Project Management CRUD
* **Issue:** `routes/projects.js` only implemented a single `POST /create` route. 
* **Impact:** There was no project listing page, no project edit form, and no project deletion mechanism. Users could create projects, but couldn't manage, inspect, or delete them outside of the Gantt dashboard.

### 1.4. Broken UI Navigation & Redirection
* **Issue:** 
  1. The top navigation bar (`views/partials/navbar.ejs`) lacked a direct link to "Projects".
  2. After creating a project in `views/projects/create.ejs`, the form and back buttons incorrectly pointed to `/milestones` instead of a dedicated `/projects` view.

### 1.5. Missing Environment Configuration (`.env`)
* **Issue:** Only `.env.example` existed in the repository. There was no `.env` file containing local connection strings for `mysql2/promise` and session secret keys.
* **Impact:** The application would crash on startup due to missing database credentials.

### 1.6. Missing Runtime Binaries & Database Initialization
* **Issue:** 
  1. Node.js and MySQL Server were not installed/configured in the system PATH.
  2. `node_modules/` was missing.
  3. Database `smarstruction_db` with its 21 tables and seed data was not yet initialized.

### 1.7. Absence of Handover & Demonstration Documentation
* **Issue:** There was no step-by-step click guide for project demonstration, nor an architectural progress tracker for team members and evaluators.

---

## ✅ 2. What Was Changed & Implemented (Fixes)

### 2.1. Complete MVC Architecture Refactoring
* **Created 20 Dedicated Controller Modules** under `controllers/`:
  1. `authController.js` — Secure authentication, registration, session destruction.
  2. `materialController.js` — Member A (Feature 1): Materials CRUD.
  3. `vendorController.js` — Member B (Feature 2): Vendor directory & rating CRUD.
  4. `milestoneController.js` — Member C (Feature 3): Project milestones CRUD.
  5. `dashboardController.js` — Member D (Feature 5): Public CMS homepage & dashboard analytics.
  6. `purchaseOrderController.js` — Member A (Feature 6): Multi-item POs with atomic transactions.
  7. `deliveryController.js` — Member B (Feature 7): Delivery status scheduling & cascading PO updates.
  8. `laborController.js` — Member C (Feature 8): Daily labor logs & wage tracking.
  9. `inventoryTransferController.js` — Member A (Feature 9): Inter-site material transfer workflow.
  10. `noticeController.js` — Member D (Feature 10): Public notice board & SuperAdmin CMS.
  11. `projectController.js` — Member C (Feature 11): Gantt-lite progress calculation + full project CRUD.
  12. `priceComparisonController.js` — Member B (Feature 12): Material price quotation comparison.
  13. `materialRequestController.js` — Member D (Feature 13): Priority emergency material requests.
  14. `wasteLogController.js` — Member A (Feature 14): Material wastage and damage tracking.
  15. `contractController.js` — Member B (Feature 15): Multer file upload & contract management.
  16. `boqController.js` — Member A (Feature 16): Bill of Quantities generator with CSV export.
  17. `expenseController.js` — Member C (Feature 17): Multi-table aggregated financial reporting & CSV export.
  18. `siteReportController.js` — Member C (Feature 18): Auto-aggregating daily site progress reports.
  19. `paymentController.js` — Member B (Feature 19): Vendor ledger, payments & financial statements.
  20. `equipmentController.js` — Member D (Feature 20): Heavy machinery registry & maintenance scheduling.

* **Converted All 22 Route Files to Thin Dispatchers**:
  All files under `routes/` were rewritten to contain only route definitions, role-based access control middleware (`isAuthenticated`, `hasRole`), and delegating calls to controller methods (reduced from hundreds of lines of mixed SQL to clean 5-15 line modules).

### 2.2. Security Vulnerability Remediated
* **Fixed in `controllers/authController.js`**:
  * Removed the insecure `password === 'admin123'` backdoor.
  * Enforced strict `bcrypt.compare(password, user.password)` validation.
  * Added post-login redirection support (`req.session.returnTo || '/dashboard'`).

### 2.3. Full Project CRUD & Views Created
* **Added in `controllers/projectController.js` & `routes/projects.js`**:
  * `GET /projects` → `listProjects()`: Displays all construction sites.
  * `GET /projects/create` → `showCreateForm()`: Project creation form.
  * `POST /projects/create` → `createProject()`: Inserts project with budget & target completion date.
  * `GET /projects/edit/:id` → `showEditForm()`: Pre-populated edit form.
  * `POST /projects/edit/:id` → `updateProject()`: Updates project details & status (Planning, Ongoing, Completed, On Hold).
  * `POST /projects/delete/:id` → `deleteProject()`: Removes project record.
* **Created Views**:
  * `views/projects/index.ejs`: Complete table with status badges and Edit/Delete action buttons.
  * `views/projects/edit.ejs`: Form for editing project details.
* **Updated UI Links**:
  * `views/partials/navbar.ejs`: Added direct `Projects` navigation item.
  * `views/projects/create.ejs`: Fixed back links and form redirections.

### 2.4. Environment & Database Configuration
* Installed **Node.js LTS (v24.19.0)** and **MySQL Server 8.4**.
* Configured persistent MySQL database directory in `F:\UserRelocatedData\mysql-data`.
* Created local configuration `.env` file:
  ```env
  PORT=3000
  DB_HOST=localhost
  DB_USER=root
  DB_PASSWORD=
  DB_NAME=smarstruction_db
  SESSION_SECRET=smarstruction_secret_key_cse470
  ```
* Installed all 132 NPM dependencies via `npm install`.
* Executed `database/schema.sql` importing all 21 relational tables and initial seed data.

### 2.5. Comprehensive Documentation Created
1. `progress.md`: Detailed system architecture, RBAC breakdown, sprint mapping, and handover instructions.
2. `CSE470_Demo_Guide.md`: Step-by-step click paths, test credentials, and talking points for each of the 20 features for presentation day.
3. `CSE470_Project_Feature_Doc.md`: Comprehensive academic feature documentation with database schemas and SQL queries.
4. `fix_issues.md`: This comprehensive change log and audit summary.

### 2.6. Robust Server-Side Input Validation & Error Handling Layer
* **Created `middleware/validate.js`**: Pure JavaScript validation library providing non-negative number checks, date format checks, email verification, integer headcount checks, and HTML/tag sanitization.
* **Integrated Pre-Query Validation across all 20 Controllers**:
  * **Auth**: Email formatting, minimum 6-character password enforcement, role whitelisting.
  * **Materials / Vendors**: Positive stock/threshold checks, valid rating ranges (0–10).
  * **Projects / Milestones**: Start date $\le$ Target date logic validation, non-negative budgets.
  * **Purchase Orders / Inventory Transfers**: Quantity $> 0$, non-negative price rates, prevention of transferring materials to the same site.
  * **File Uploads (Contracts)**: Strict file extension filter (PDF, DOC, DOCX, PNG, JPG) and 15MB file size limit.
* **Global Error Middleware (`server.js`)**: Added centralized 404 and 500 error handlers that render user-friendly error views (`views/error.ejs`) without application crashes or unhandled promise rejections.

---

## 🎯 3. Verification & Compliance Status

| University Requirement | Initial State | Final State | Status |
|------------------------|---------------|-------------|--------|
| **Strict MVC Pattern** | ❌ Missing (`controllers/` absent) | ✅ 20 controllers created, thin routes | **COMPLIANT** |
| **No ORM (Raw SQL Only)** | ✅ Raw SQL used in routes | ✅ Raw SQL preserved across controllers (`db.query`) | **COMPLIANT** |
| **No Django / Flask** | ✅ Node.js / Express | ✅ Node.js / Express | **COMPLIANT** |
| **20 Features (5 per Member)** | ✅ 20/20 present | ✅ 20/20 verified with full CRUD | **COMPLIANT** |
| **Input Validation & Safety** | ⚠️ Minimal / client-only | ✅ Server-side pre-query validation on all 20 controllers | **COMPLIANT** |
| **Error Handling & Resilience** | ⚠️ Basic console logs | ✅ Graceful error views + Global 500 handler + Transaction rollbacks | **ROBUST** |
| **Authentication Security** | ❌ Backdoor password bypass | ✅ Strict bcrypt hash verification | **SECURE** |
| **Route Health Status** | ⚠️ Unverified / crashed | ✅ All 20 feature endpoints return HTTP 200 OK | **VERIFIED** |
