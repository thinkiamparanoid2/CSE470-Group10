# CSE470 Project Feature Documentation

## Project: SmartConstruct BD (SmartConstruction)
### Construction Project & Material Management System

---

## Technology Stack
- **Backend:** Node.js v24 + Express.js
- **Database:** MySQL 8.4 (Raw SQL via mysql2/promise — No ORM)
- **Frontend:** EJS Templating + Custom Glassmorphism CSS
- **Auth:** Session-based (express-session + bcryptjs)
- **File Upload:** Multer
- **Architecture:** MVC (Model-View-Controller)

## Roles
| Role | Description |
|------|------------|
| SuperAdmin | Full system access, all CRUD, user management |
| Project Manager | Project, material, vendor, financial management |
| Site Engineer | Site operations, labor logging, report generation |
| Vendor/Supplier | View own deliveries, contracts, payments |

---

## Sprint 1: Foundation & Baseline Setup (Deadline: July 20, 2026)

### Feature 1: Material Stock Tracking (Member A)
- **Description:** Full CRUD for construction materials with stock level monitoring and reorder alerts.
- **URL:** `/materials`
- **Database Table:** `materials` (columns: id, name, category, unit, current_stock, reorder_level, unit_price_est, created_at)
- **Controller:** `controllers/materialController.js`
- **Views:** `views/materials/index.ejs`, `create.ejs`, `edit.ejs`
- **Key SQL:**
  ```sql
  SELECT * FROM materials ORDER BY name ASC
  INSERT INTO materials (name, category, unit, current_stock, reorder_level, unit_price_est) VALUES (?, ?, ?, ?, ?, ?)
  UPDATE materials SET name=?, category=?, unit=?, current_stock=?, reorder_level=?, unit_price_est=? WHERE id=?
  DELETE FROM materials WHERE id=?
  ```
- **CRUD:** Create ✅ | Read ✅ | Update ✅ | Delete ✅

### Feature 2: Vendor Directory & Rating (Member B)
- **Description:** Vendor profile management with rating system for quality assessment.
- **URL:** `/vendors`
- **Database Table:** `vendors` (columns: id, company_name, contact_person, email, phone, address, material_category, rating, user_id, created_at)
- **Controller:** `controllers/vendorController.js`
- **Views:** `views/vendors/index.ejs`, `create.ejs`, `edit.ejs`
- **Key SQL:**
  ```sql
  SELECT * FROM vendors ORDER BY rating DESC
  INSERT INTO vendors (company_name, contact_person, email, phone, address, material_category, rating) VALUES (?, ?, ?, ?, ?, ?, ?)
  ```
- **CRUD:** Create ✅ | Read ✅ | Update ✅ | Delete ✅

### Feature 3: Milestone Tracker (Member C)
- **Description:** Track project milestones with status workflow (Pending → In Progress → Completed).
- **URL:** `/milestones`
- **Database Tables:** `milestones` (FK → `projects`)
- **Controller:** `controllers/milestoneController.js`
- **Views:** `views/milestones/index.ejs`, `edit.ejs`
- **Key SQL:**
  ```sql
  SELECT m.*, p.name AS project_name FROM milestones m JOIN projects p ON m.project_id = p.id ORDER BY m.due_date ASC
  ```
- **CRUD:** Create ✅ | Read ✅ | Update ✅ | Delete ✅

### Feature 4: Role-Based Access Control — RBAC (Member D)
- **Description:** 4-tier authentication system with session-based login, registration, and role-based middleware.
- **URL:** `/login`, `/register`, `/logout`
- **Database Table:** `users` (columns: id, name, email, password, role, phone, created_at)
- **Controller:** `controllers/authController.js`
- **Middleware:** `middleware/auth.js` — `isAuthenticated()` + `hasRole(...roles)`
- **Key SQL:**
  ```sql
  SELECT * FROM users WHERE email = ?
  INSERT INTO users (name, email, password, role, phone) VALUES (?, ?, ?, ?, ?)
  ```
- **Security:** Passwords hashed with bcryptjs (10 salt rounds)

### Feature 5: CMS for Company Homepage (Member D)
- **Description:** Public-facing landing page displaying company info, recent notices, and featured projects.
- **URL:** `/` (root)
- **Database Tables:** Reads from `notices` and `projects`
- **Controller:** `controllers/dashboardController.js` → `showHomePage()`
- **View:** `views/home.ejs`
- **Key SQL:**
  ```sql
  SELECT * FROM notices ORDER BY created_at DESC LIMIT 5
  SELECT * FROM projects LIMIT 3
  ```

---

## Sprint 2: Core Daily Operations (Deadline: August 2, 2026)

### Feature 6: Purchase Order System (Member A)
- **Description:** Multi-item purchase orders with vendor selection, cost calculation, and approval workflow.
- **URL:** `/purchase_orders`
- **Database Tables:** `purchase_orders` (FK → vendors, users), `purchase_order_items` (FK → purchase_orders, materials)
- **Controller:** `controllers/purchaseOrderController.js`
- **Key Feature:** Database transactions (BEGIN → INSERT PO → INSERT items → COMMIT)
- **Key SQL:**
  ```sql
  -- Uses transaction
  INSERT INTO purchase_orders (vendor_id, expected_date, total_amount, created_by) VALUES (?, ?, ?, ?)
  INSERT INTO purchase_order_items (po_id, material_id, quantity, unit_price) VALUES (?, ?, ?, ?)
  ```
- **Workflow:** Draft → Approved → Delivered/Rejected

### Feature 7: Delivery Scheduling (Member B)
- **Description:** Track material deliveries linked to approved POs with vendor-scoped visibility.
- **URL:** `/deliveries`
- **Database Table:** `deliveries` (FK → purchase_orders, users)
- **Controller:** `controllers/deliveryController.js`
- **Key Feature:** Auto-created when PO is approved; Vendor role sees only own deliveries
- **Workflow:** Pending → In Transit → Delivered

### Feature 8: Labor Attendance & Cost Log (Member C)
- **Description:** Daily worker attendance logging with headcount and cost tracking per project.
- **URL:** `/labor`
- **Database Table:** `labor_logs` (FK → projects, users)
- **Controller:** `controllers/laborController.js`
- **Key SQL:**
  ```sql
  INSERT INTO labor_logs (project_id, log_date, headcount, total_cost, notes, created_by) VALUES (?, ?, ?, ?, ?, ?)
  ```

### Feature 9: Site-wise Inventory Transfer (Member A)
- **Description:** Request and approve material transfers between construction project sites.
- **URL:** `/inventory-transfers`
- **Database Table:** `inventory_transfers` (FK → materials, projects ×2, users)
- **Controller:** `controllers/inventoryTransferController.js`
- **Key Feature:** Prevents transfer to same project; PM/SuperAdmin approval required
- **Workflow:** Pending → Approved/Rejected

### Feature 10: Notice / Announcement Board (Member D)
- **Description:** Internal notice system with public board (all users) and admin CMS (SuperAdmin/PM).
- **URL:** `/notices/board` (read), `/notices` (CMS)
- **Database Table:** `notices` (FK → users)
- **Controller:** `controllers/noticeController.js`
- **Key Feature:** Dual interface — public board and admin management
- **CRUD:** Create ✅ | Read ✅ | Update ✅ | Delete ✅

---

## Sprint 3: Advanced Tracking & Optimization (Deadline: August 14, 2026)

### Feature 11: Project Progress Dashboard — Gantt-lite (Member C)
- **Description:** Visual project progress dashboard with auto-calculated completion percentage from milestones.
- **URL:** `/dashboard_projects`
- **Database Tables:** `projects`, `milestones`
- **Controller:** `controllers/projectController.js` → `progressDashboard()`
- **Key Logic:** `progress = (completed_milestones / total_milestones) × 100`

### Feature 12: Price Comparison Engine (Member B)
- **Description:** Compare vendor quotations for materials, sorted by lowest price.
- **URL:** `/price-comparison`
- **Database Tables:** `vendor_quotations` (FK → vendors, materials)
- **Controller:** `controllers/priceComparisonController.js`
- **Key SQL:**
  ```sql
  SELECT vq.price, v.company_name, v.rating FROM vendor_quotations vq
  JOIN vendors v ON vq.vendor_id = v.id WHERE vq.material_id = ? ORDER BY vq.price ASC
  ```

### Feature 13: Emergency Material Request (Member D)
- **Description:** Priority-flagged material requests with Emergency/High/Normal sorting.
- **URL:** `/material-requests`
- **Database Table:** `material_requests` (FK → projects, materials, users)
- **Controller:** `controllers/materialRequestController.js`
- **Key SQL:**
  ```sql
  ORDER BY CASE priority WHEN 'Emergency' THEN 1 WHEN 'High' THEN 2 WHEN 'Normal' THEN 3 END ASC
  ```

### Feature 14: Material Waste Log (Member A)
- **Description:** Track material wastage per project with reason documentation.
- **URL:** `/waste-logs`
- **Database Table:** `material_waste_logs` (FK → projects, materials, users)
- **Controller:** `controllers/wasteLogController.js`

### Feature 15: Contract Document Upload (Member B)
- **Description:** Upload and manage vendor contract documents (PDF, DOC, etc.) using multer file upload.
- **URL:** `/contracts`
- **Database Table:** `vendor_contracts` (FK → vendors, users)
- **Controller:** `controllers/contractController.js`
- **Key Feature:** Multer disk storage, vendor-scoped visibility

---

## Sprint 4: Reporting, Financials & Analytics (Deadline: August 26, 2026)

### Feature 16: Bill of Quantities — BOQ Generator (Member A)
- **Description:** Create detailed BOQ worksheets with multi-item support and CSV export.
- **URL:** `/boq`
- **Database Tables:** `boqs` (FK → projects, users), `boq_items` (FK → boqs)
- **Controller:** `controllers/boqController.js`
- **Key Feature:** CSV export with UTF-8 BOM, auto-calculated totals

### Feature 17: Project Expense Report Export (Member C)
- **Description:** Consolidated financial reports aggregating labor, waste, and material costs.
- **URL:** `/expenses`
- **Controller:** `controllers/expenseController.js`
- **Key Feature:** Cross-table aggregation (labor_logs + material_waste_logs + material_requests + inventory_transfers), CSV export

### Feature 18: Daily Site Report (Member C)
- **Description:** Generate daily progress reports with auto-aggregated data from labor, waste, and requests.
- **URL:** `/site-reports`
- **Database Table:** `daily_site_reports` (FK → projects, users)
- **Controller:** `controllers/siteReportController.js`
- **Key Feature:** Aggregates labor logs, waste logs, and emergency requests for the report date

### Feature 19: Vendor Payment Tracker (Member B)
- **Description:** Financial dashboard with payment recording, outstanding balance tracking, and vendor account statements.
- **URL:** `/payments`
- **Database Table:** `vendor_payments` (FK → vendors, purchase_orders, users)
- **Controller:** `controllers/paymentController.js`
- **Key Feature:** Ledger/statement view, aggregated billing from POs

### Feature 20: Equipment Maintenance Scheduler (Member D)
- **Description:** Heavy machinery registry with maintenance scheduling, status workflow, and DB transactions.
- **URL:** `/equipment`
- **Database Tables:** `equipment` (FK → projects), `maintenance_schedules` (FK → equipment, users)
- **Controller:** `controllers/equipmentController.js`
- **Key Feature:** Transaction-based status sync (equipment ↔ maintenance)
- **Workflow:** Scheduled → In Progress → Completed (equipment auto-updates)

---

## University Compliance

| Requirement | Status |
|------------|--------|
| No ORM (raw SQL only) | ✅ All queries use `db.query()` with mysql2/promise |
| No Django/Flask | ✅ Node.js + Express.js |
| MVC Structure | ✅ controllers/ + routes/ + views/ + config/ |
| 5 Features per person (excl. Login/Signup) | ✅ 4 members × 5 features = 20 |
| Session-based authentication | ✅ express-session + bcryptjs |
| 4 User Roles | ✅ SuperAdmin, Project Manager, Site Engineer, Vendor |
