# 🏗️ SmartConstruct BD — Step-by-Step Feature Demonstration Guide

> **CSE470 Group 10** | Sprint 1-4 Complete Demo Instructions  
> Open browser → Navigate to **http://localhost:3000**

---

## 🔐 Test Accounts for Demonstration

| Role | Email | Password |
|------|-------|----------|
| **SuperAdmin** | admin@smarstruction.bd | admin123 |
| **Project Manager** | pm@smarstruction.bd | admin123 |
| **Site Engineer** | engineer@smarstruction.bd | admin123 |
| **Vendor** | vendor@bsrm.bd | admin123 |

---

## 🚀 How to Start the Application

```bash
# Step 1: Start MySQL (via XAMPP Control Panel or command line)
# Ensure MySQL is running on localhost:3306

# Step 2: Start the application
cd "d:\CSE470-Project\CSE470-Group10"
npm start
```

Then open **http://localhost:3000** in your browser.

---

## SPRINT 1: Foundation & Baseline Setup (5 Features)

---

### Feature 1: Material Stock Tracking (Member A)

**Route:** `/materials`

**Demonstration Steps:**
1. Login as **SuperAdmin** (admin@smarstruction.bd / admin123)
2. Click **"Materials"** in the navigation bar
3. You will see the **Material Stock Tracking** page with a list of pre-loaded materials (Cement, TMT Steel Rod, etc.)
4. Click **"+ Add New"** button
5. Fill in: Name: "River Sand", Category: "Aggregate", Unit: "cft", Stock: 5000, Reorder Level: 500, Price Est: 25
6. Click **"Add Material"** → You'll be redirected to the list with the new material
7. Click **"Edit"** on any material → Modify the stock quantity → Click **"Update"**
8. Click **"Delete"** on any material → Confirm deletion

**What to show the evaluator:**
- Full CRUD operations (Create, Read, Update, Delete)
- Raw SQL queries used (show `controllers/materialController.js`)
- Stock level tracking with reorder alerts

---

### Feature 2: Vendor Directory & Rating (Member B)

**Route:** `/vendors`

**Demonstration Steps:**
1. Click **"Vendors"** in the navigation bar
2. See vendor list sorted by rating (highest first)
3. Click **"+ Add Vendor"** button
4. Fill in: Company: "ABC Suppliers", Contact: "John", Email: "abc@test.com", Phone: "01700000000", Category: "Electrical", Rating: 8.5
5. Click **"Add Vendor"** → See it appear in the list
6. Click **"Edit"** → Change the rating → Click **"Update Vendor"**
7. Click **"Delete"** → Confirm

**What to show:**
- Vendor profiles with rating system
- Sorted by rating for quick quality comparison

---

### Feature 3: Milestone Tracker (Member C)

**Route:** `/milestones`

**Demonstration Steps:**
1. Click **"Milestones"** in the navigation bar
2. See existing milestones linked to projects
3. In the "Add Milestone" form at top:
   - Select Project: "Dhanmondi High-Rise Tower"
   - Title: "Foundation Complete"
   - Description: "All foundation work finished"
   - Due Date: select a future date
4. Click **"Create Milestone"**
5. Click **"Edit"** → Change status to "Completed" → Click **"Update"**
6. Click **"Delete"** to remove

**What to show:**
- Milestones linked to specific projects (foreign key relationship)
- Status workflow: Pending → In Progress → Completed

---

### Feature 4: Role-Based Access Control — RBAC (Member D)

**Route:** `/login`, `/register`

**Demonstration Steps:**
1. Go to **http://localhost:3000/login**
2. Login as SuperAdmin → Show full navigation (all links visible)
3. Logout (click "Logout" button)
4. Login as **Site Engineer** (engineer@smarstruction.bd / admin123)
   - Notice: Cannot see "Notice CMS" link
   - Try to access materials → Can view but no Create/Edit/Delete buttons
5. Logout → Login as **Vendor** (vendor@bsrm.bd / admin123)
   - Notice: Very limited navigation
   - Can only see Deliveries, Contracts, Payments, Notice Board
6. Go to **/register** → Show the registration form with role selection
7. Register a new user with any role → Login with new credentials

**What to show:**
- 4 distinct roles with different permissions
- Middleware-based access control (`isAuthenticated` + `hasRole`)
- Show `middleware/auth.js` code

---

### Feature 5: CMS for Company Homepage (Member D)

**Route:** `/` (root URL)

**Demonstration Steps:**
1. **Logout** first (or open incognito window)
2. Navigate to **http://localhost:3000/**
3. See the **public landing page** with:
   - Company information & hero section
   - Recent notices/announcements
   - Featured projects
4. This page is **publicly accessible** — no login required
5. Show that the notices displayed here are managed from the Notice CMS (Feature 18)

**What to show:**
- Public-facing website
- Dynamic content from database (notices + projects)
- No authentication required

---

## SPRINT 2: Core Daily Operations (5 Features)

---

### Feature 6: Purchase Order System (Member A)

**Route:** `/purchase_orders`

**Demonstration Steps:**
1. Login as **SuperAdmin**
2. Click **"POs"** in navigation
3. Click **"Create Purchase Order"**
4. Select Vendor: "BSRM Steels Ltd"
5. Select Material: "TMT Steel Rod", Quantity: 100, Unit Price: 95
6. (Optional) Click "Add Item" to add more line items
7. Set Expected Date → Click **"Create PO"**
8. Back on list, click **"Approve"** on the new PO
   - This automatically creates a delivery record!
9. Show the PO list with status badges

**What to show:**
- Multi-item purchase orders (1 PO can have multiple materials)
- Database transactions (atomic PO + items creation)
- Auto-delivery creation on approval

---

### Feature 7: Delivery Scheduling (Member B)

**Route:** `/deliveries`

**Demonstration Steps:**
1. Click **"Deliveries"** in navigation
2. See delivery records linked to approved POs
3. Update status: Pending → In Transit → Delivered
4. When marked "Delivered", PO status also updates automatically
5. Login as **Vendor** to show vendor-scoped view (only sees own deliveries)

**What to show:**
- Delivery tracking with status workflow
- Vendor-scoped visibility
- Cascading status updates (Delivery → PO)

---

### Feature 8: Labor Attendance & Cost Log (Member C)

**Route:** `/labor`

**Demonstration Steps:**
1. Click **"Labor"** in navigation
2. Click **"Log Daily Labor"**
3. Select Project: "Dhanmondi High-Rise Tower"
4. Date: today, Headcount: 25, Total Cost: 37500, Notes: "Foundation excavation crew"
5. Click **"Log Attendance"**
6. See the labor log list sorted by date

**What to show:**
- Daily labor tracking per project
- Cost tracking for financial reporting
- Data feeds into Expense Reports (Feature 14)

---

### Feature 9: Site-wise Inventory Transfer (Member A)

**Route:** `/inventory-transfers`

**Demonstration Steps:**
1. Click **"Transfers"** in navigation
2. Click **"Request Transfer"**
3. Select Material: "Cement"
4. From Project: "Dhanmondi High-Rise Tower"
5. To Project: "Uttara Residential Villa Project"
6. Quantity: 200
7. Click **"Submit Transfer Request"**
8. Back on list: Approve or Reject the transfer (PM/SuperAdmin only)

**What to show:**
- Inter-site material movement tracking
- Approval workflow (Pending → Approved/Rejected)
- Role-based approval (only PM and SuperAdmin can approve)

---

### Feature 10: Notice / Announcement Board (Member D)

**Route:** `/notices/board` (all users) and `/notices` (admin CMS)

**Demonstration Steps:**
1. Click **"Notice Board"** → See all announcements (public to all logged-in users)
2. Login as SuperAdmin/PM → Click **"Notice CMS"**
3. Click **"Create New Notice"**
4. Title: "Safety Drill Tomorrow", Content: "All sites must conduct safety drills", Priority: "High"
5. Click **"Create Notice"**
6. Edit the notice → Change priority → Update
7. Switch to Notice Board view → See the new notice
8. Delete the notice from CMS

**What to show:**
- Dual interface: Public board (read) + Admin CMS (CRUD)
- Priority levels (Normal, High, Urgent)
- CMS access restricted to SuperAdmin/PM only

---

## SPRINT 3: Advanced Tracking & Optimization (5 Features)

---

### Feature 11: Project Progress Dashboard — Gantt-lite (Member C)

**Route:** `/dashboard_projects`

**Demonstration Steps:**
1. Click **"Gantt"** in navigation
2. See all projects with visual progress bars
3. Progress is auto-calculated from milestones:
   - % = (Completed milestones / Total milestones) × 100
4. Shows start date, target completion, milestone counts

**What to show:**
- Automated progress calculation
- Visual progress bars
- Timeline overview of all projects

---

### Feature 12: Price Comparison Engine (Member B)

**Route:** `/price-comparison`

**Demonstration Steps:**
1. Click **"Prices"** in navigation
2. Select a material from the dropdown (e.g., "Cement" or "TMT Steel Rod")
3. See vendor quotations sorted by **lowest price first**
4. Shows: Vendor name, price, rating, phone number, last updated date
5. Compare prices across vendors side-by-side

**What to show:**
- Material-based vendor price comparison
- Sorted by price for cost optimization
- Vendor ratings included for quality-cost decisions

---

### Feature 13: Emergency Material Request (Member D)

**Route:** `/material-requests`

**Demonstration Steps:**
1. Click **"Requests"** in navigation
2. Fill the form: Project → Material → Quantity → Priority: **"Emergency"**
3. Click **"Submit Request"**
4. See the list sorted by priority (Emergency → High → Normal)
5. As SuperAdmin/PM: Click **"Approve"** or **"Reject"**

**What to show:**
- Priority-based sorting (Emergency first)
- Request-approval workflow
- Role-based approval restrictions

---

### Feature 14: Material Waste Log (Member A)

**Route:** `/waste-logs`

**Demonstration Steps:**
1. Click **"Waste"** in navigation
2. Fill the form: Project → Material → Quantity wasted → Reason: "Damaged during transport" → Date
3. Click **"Log Waste"**
4. See the waste log list with material names and quantities

**What to show:**
- Waste tracking per project
- Waste data feeds into expense reports
- Accountability through logged_by user tracking

---

### Feature 15: Contract Document Upload (Member B)

**Route:** `/contracts`

**Demonstration Steps:**
1. Click **"Contracts"** in navigation
2. Select Vendor → Enter title: "BSRM Steel Supply Q3 2026"
3. Choose a PDF/document file from your computer
4. Click **"Upload Contract"**
5. See the contract in the list with download link
6. Click the file link to view/download the uploaded document

**What to show:**
- File upload functionality (multer)
- Vendor-linked document management
- Vendor-scoped view (vendors only see their own contracts)

---

## SPRINT 4: Reporting, Financials & Analytics (5 Features)

---

### Feature 16: Bill of Quantities — BOQ Generator (Member A)

**Route:** `/boq`

**Demonstration Steps:**
1. Click **"BOQ"** in navigation
2. Click **"Create New BOQ"**
3. Select Project → Enter Title: "Foundation Materials BOQ"
4. Click **"Create BOQ"** → Opens the BOQ worksheet
5. Add items:
   - Material: "Cement", Unit: "bag", Qty: 500, Price: 450, Category: "Material"
   - Material: "TMT Steel Rod", Unit: "ton", Qty: 10, Price: 80000, Category: "Material"
6. See running total automatically calculated
7. Click **"Export to CSV"** → Downloads a CSV file
8. Open the CSV in Excel to show formatted report

**What to show:**
- Multi-item BOQ creation
- Auto-calculated totals
- CSV export for external use

---

### Feature 17: Project Expense Report Export (Member C)

**Route:** `/expenses`

**Demonstration Steps:**
1. Click **"Expenses"** in navigation
2. See project list with total expenditure and remaining budget
3. Click **"View Detailed Report"** on any project
4. See the consolidated report with:
   - Labor costs (from labor logs)
   - Material waste valuations
   - Material request costs
5. Optionally filter by date range
6. Click **"Export CSV"** → Download financial report

**What to show:**
- Aggregated financial data from multiple tables
- Cross-module data integration (labor + waste + materials)
- CSV export capability

---

### Feature 18: Daily Site Report (Member C)

**Route:** `/site-reports`

**Demonstration Steps:**
1. Click **"Site Reports"** in navigation
2. Click **"Generate New Report"**
3. Select Project, enter date, weather, progress notes, safety status
4. Click **"Submit Report"**
5. Click **"View"** on the new report
6. See auto-aggregated data:
   - Labor logs for that date
   - Waste logs for that date
   - Emergency requests for that date

**What to show:**
- Auto-aggregation of daily data from other modules
- Comprehensive daily snapshot
- Print-friendly layout (Ctrl+P to show print styles)

---

### Feature 19: Vendor Payment Tracker (Member B)

**Route:** `/payments`

**Demonstration Steps:**
1. Click **"Payments"** in navigation
2. See vendor financial dashboard (total billed, total paid, outstanding)
3. Click **"Record Payment"**
4. Select Vendor → Amount: 50000 → Type: "Partial" → Method: "Bank Transfer"
5. Click **"Record Payment"**
6. Click **"View Statement"** on any vendor
7. See the full ledger: purchase orders, payments, running balance

**What to show:**
- Financial dashboard with outstanding balances
- Payment recording with multiple types
- Vendor account statement (ledger view)

---

### Feature 20: Equipment Maintenance Scheduler (Member D)

**Route:** `/equipment`

**Demonstration Steps:**
1. Click **"Equipment"** in navigation
2. Click **"Register Equipment"**
3. Name: "CAT 320 Excavator", Code: "EXC-001", Category: "Heavy Machinery", Project: select one
4. Click **"Register"**
5. Click **"Schedule Maintenance"**
6. Select the new equipment → Date → Type: "Routine Check-up" → Description → Cost estimate
7. Click **"Schedule"**
8. Back on dashboard: Update maintenance status → "In Progress" → "Completed"
9. Notice equipment status changes automatically (Operational ↔ Under Maintenance)

**What to show:**
- Equipment registry with project assignment
- Maintenance scheduling workflow
- DB transactions (equipment status + maintenance status updated atomically)

---

## 🎯 Cross-Cutting Features to Highlight

### MVC Architecture
Show the file structure:
```
controllers/   → 20 controller files (business logic)
routes/        → 22 thin route files (HTTP dispatching)
views/         → 51 EJS template files (presentation)
config/db.js   → Database connection (Model layer)
```

### Raw SQL (No ORM)
Open any controller file and show:
```javascript
const [results] = await db.query('SELECT * FROM materials WHERE id = ?', [id]);
```

### Session-Based Authentication
Show `middleware/auth.js`:
- `isAuthenticated()` - checks session
- `hasRole(...roles)` - checks user role against allowed roles

---

## 📋 Quick Checklist for Demo Day

- [ ] MySQL server running
- [ ] `npm start` executed
- [ ] Browser open at http://localhost:3000
- [ ] Login as SuperAdmin first (show full access)
- [ ] Demonstrate each feature with Create/Read operations
- [ ] Show RBAC by switching between roles
- [ ] Show CSV exports (BOQ + Expenses)
- [ ] Show file upload (Contracts)
- [ ] Show code: controllers/, middleware/auth.js, raw SQL queries
