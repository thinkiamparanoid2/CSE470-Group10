# 🏗️ SmartConstruct BD (SmartConstruction) — Project Progress & Handoff Document

> **CSE470 Group 10** | Smart Construction Management Platform  
> **Last Updated:** August 25, 2026  
> **Tech Stack:** Node.js + Express.js + Raw MySQL (`mysql2/promise`) + EJS + Glassmorphism CSS  
> **Architecture:** MVC (Model-View-Controller) with Raw SQL  

---

## 📊 Overall Status: ALL 20 FEATURES COMPLETE ✅

### Sprint Completion Summary

| Sprint | Deadline | Features | Status |
|--------|----------|----------|--------|
| Sprint 1: Foundation & Baseline | July 20, 2026 | 5 | ✅ Complete |
| Sprint 2: Core Operations | August 2, 2026 | 5 | ✅ Complete |
| Sprint 3: Advanced Optimization | August 14, 2026 | 5 | ✅ Complete |
| Sprint 4: Reporting & Financials | August 26, 2026 | 5 | ✅ Complete |

---

## 🏛️ Architecture: MVC Pattern

```
CSE470-Group10/
├── config/           # Database configuration
│   └── db.js         # mysql2/promise connection pool (Raw SQL only)
├── controllers/      # Business logic (20 controller files)
│   ├── authController.js
│   ├── materialController.js
│   ├── vendorController.js
│   ├── milestoneController.js
│   ├── projectController.js
│   ├── dashboardController.js
│   ├── purchaseOrderController.js
│   ├── deliveryController.js
│   ├── laborController.js
│   ├── inventoryTransferController.js
│   ├── noticeController.js
│   ├── priceComparisonController.js
│   ├── materialRequestController.js
│   ├── wasteLogController.js
│   ├── contractController.js
│   ├── boqController.js
│   ├── paymentController.js
│   ├── expenseController.js
│   ├── siteReportController.js
│   └── equipmentController.js
├── middleware/       # Authentication & RBAC middleware
│   └── auth.js       # isAuthenticated + hasRole(...roles)
├── routes/           # Thin route dispatchers (22 route files)
│   ├── index.js, auth.js, dashboard.js
│   ├── materials.js, vendors.js, milestones.js, projects.js
│   ├── purchase_orders.js, deliveries.js, labor.js
│   ├── inventory_transfers.js, notices.js, dashboard_projects.js
│   ├── price_comparison.js, material_requests.js, waste_logs.js
│   ├── contracts.js, boq.js, payments.js
│   ├── expenses.js, site_reports.js, equipment.js
├── views/            # EJS templates (51 files across 19 subdirectories)
│   ├── partials/     # navbar.ejs, footer.ejs
│   ├── home.ejs, dashboard.ejs, login.ejs, register.ejs, error.ejs
│   └── [18 feature subdirectories with index/create/edit/view templates]
├── public/
│   ├── css/style.css # Glassmorphism theme + print/PDF styles
│   └── uploads/      # Contract document uploads
├── database/
│   └── schema.sql    # 21 tables + seed data (Raw SQL DDL)
├── .env              # Database credentials
├── server.js         # Express app entry point
└── package.json      # Dependencies
```

---

## 👥 Role-Based Access Control (RBAC)

| Role | Dashboard | Materials CRUD | Vendors CRUD | Projects | PO/Delivery | Labor | Reports | Admin |
|------|-----------|---------------|-------------|----------|------------|-------|---------|-------|
| **SuperAdmin** | ✅ | ✅ Full | ✅ Full | ✅ Full | ✅ Full | ✅ | ✅ | ✅ Notice CMS |
| **Project Manager** | ✅ | ✅ Full | ✅ Full | ✅ Full | ✅ Full | ✅ | ✅ | ✅ Notice CMS |
| **Site Engineer** | ✅ | Read Only | Read Only | Read Only | View + Receive | ✅ | ✅ | ❌ |
| **Vendor** | ✅ | ❌ | ❌ | ❌ | Own Deliveries | ❌ | ❌ | ❌ |

---

## 📋 Feature Breakdown (20 Features)

### Member A: Materials & Inventory (5 Features)

| # | Feature | Route | Controller | Views | Tables |
|---|---------|-------|-----------|-------|--------|
| 1 | Material Stock Tracking | `/materials` | `materialController.js` | index/create/edit | `materials` |
| 2 | Purchase Order System | `/purchase_orders` | `purchaseOrderController.js` | index/create | `purchase_orders`, `purchase_order_items` |
| 3 | Site-wise Inventory Transfer | `/inventory-transfers` | `inventoryTransferController.js` | index/create | `inventory_transfers` |
| 4 | Material Waste Log | `/waste-logs` | `wasteLogController.js` | index | `material_waste_logs` |
| 5 | Bill of Quantities (BOQ) Generator | `/boq` | `boqController.js` | index/create/view + CSV export | `boqs`, `boq_items` |

### Member B: Vendors & Financials (5 Features)

| # | Feature | Route | Controller | Views | Tables |
|---|---------|-------|-----------|-------|--------|
| 6 | Vendor Directory & Rating | `/vendors` | `vendorController.js` | index/create/edit | `vendors` |
| 7 | Delivery Scheduling | `/deliveries` | `deliveryController.js` | index | `deliveries` |
| 8 | Price Comparison Engine | `/price-comparison` | `priceComparisonController.js` | index | `vendor_quotations` |
| 9 | Contract Document Upload | `/contracts` | `contractController.js` | index | `vendor_contracts` |
| 10 | Vendor Payment Tracker | `/payments` | `paymentController.js` | index/create/vendor_statement | `vendor_payments` |

### Member C: Projects, Labor & Milestones (5 Features)

| # | Feature | Route | Controller | Views | Tables |
|---|---------|-------|-----------|-------|--------|
| 11 | Milestone Tracker | `/milestones` | `milestoneController.js` | index/edit | `milestones` |
| 12 | Labor Attendance & Cost Log | `/labor` | `laborController.js` | index/create | `labor_logs` |
| 13 | Project Progress Dashboard (Gantt-lite) | `/dashboard_projects` | `projectController.js` | dashboard | `projects`, `milestones` |
| 14 | Project Expense Report Export | `/expenses` | `expenseController.js` | index/report + CSV export | Multiple aggregated |
| 15 | Daily Site Report | `/site-reports` | `siteReportController.js` | index/generate/view | `daily_site_reports` |

### Member D: System Admin, RBAC & Notices (5 Features)

| # | Feature | Route | Controller | Views | Tables |
|---|---------|-------|-----------|-------|--------|
| 16 | Role-Based Access Control (RBAC) | `/login`, `/register` | `authController.js` | login/register | `users` |
| 17 | CMS for Company Homepage | `/` | `dashboardController.js` | home.ejs | `notices`, `projects` |
| 18 | Notice / Announcement Board | `/notices` | `noticeController.js` | board/index/create/edit | `notices` |
| 19 | Emergency Material Request | `/material-requests` | `materialRequestController.js` | index | `material_requests` |
| 20 | Equipment Maintenance Scheduler | `/equipment` | `equipmentController.js` | index/create/schedule | `equipment`, `maintenance_schedules` |

---

## 🗄️ Database Schema (21 Tables)

| Table | Purpose | Foreign Keys |
|-------|---------|-------------|
| `users` | User accounts with RBAC (4 roles) | — |
| `notices` | Company announcements | → users |
| `materials` | Material catalog & stock levels | — |
| `vendors` | Vendor directory with ratings | → users |
| `projects` | Construction project sites | — |
| `milestones` | Project milestone tracker | → projects |
| `purchase_orders` | PO headers | → vendors, → users |
| `purchase_order_items` | PO line items | → purchase_orders, → materials |
| `deliveries` | Delivery tracking | → purchase_orders, → users |
| `labor_logs` | Daily labor attendance & costs | → projects, → users |
| `inventory_transfers` | Site-to-site material transfers | → materials, → projects (×2), → users |
| `vendor_quotations` | Price comparison data | → vendors, → materials |
| `material_requests` | Emergency material requests | → projects, → materials, → users |
| `material_waste_logs` | Material waste tracking | → projects, → materials, → users |
| `vendor_contracts` | Contract document metadata | → vendors, → users |
| `boqs` | Bill of Quantities headers | → projects, → users |
| `boq_items` | BOQ line items | → boqs |
| `vendor_payments` | Payment records | → vendors, → purchase_orders, → users |
| `daily_site_reports` | Daily progress reports | → projects, → users |
| `equipment` | Machinery inventory | → projects |
| `maintenance_schedules` | Maintenance scheduling | → equipment, → users |

---

## 🔑 Test Accounts (Seed Data)

| Email | Password | Role |
|-------|----------|------|
| admin@smartconstruction.bd | admin123 | SuperAdmin |
| pm@smartconstruction.bd | admin123 | Project Manager |
| engineer@smartconstruction.bd | admin123 | Site Engineer |

---

## 🚀 Setup Instructions

```bash
# 1. Clone and install
git clone <repo-url>
cd CSE470-Group10
npm install

# 2. Create .env file (already included)
# Edit .env if your MySQL password is different

# 3. Import database
mysql -u root -p < database/schema.sql

# 4. Start server
npm start
# or for development with auto-reload:
npm run dev

# 5. Open browser
# http://localhost:3000
```

---

## ✅ University Compliance Checklist

- [x] **No ORM**: All DB operations use `db.query('SELECT ...')` with `mysql2/promise`
- [x] **No Django/Flask**: Built with Node.js + Express.js
- [x] **MVC Structure**: `controllers/` + `routes/` + `views/` separation
- [x] **5 Features per Member**: 20 features across 4 members (A, B, C, D)
- [x] **Login/Signup separate**: Not counted toward feature count
- [x] **4 User Roles**: SuperAdmin, Project Manager, Site Engineer, Vendor
- [x] **Raw SQL everywhere**: No Sequelize, Prisma, or any ORM
