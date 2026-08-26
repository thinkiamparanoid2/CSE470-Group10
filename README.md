# 🏗️ SmartConstruct BD (Smarstruction)

**Course:** CSE470 — Software Engineering  
**Group:** 10  
**Domain:** Construction Project & Material Management System  
**Tech Stack:** Node.js + Express.js + Raw MySQL (`mysql2/promise`) + EJS + Custom CSS  
**Architecture:** Strict MVC (Model-View-Controller) — **No ORM**

---

## 📌 Notice for Shifting Devices & AI Agents

If you are continuing work on this project on a new device or with a new agent session, all complete project documentation has been organized into the **`md/`** directory:

1. **[`md/fix_issues.md`](md/fix_issues.md) (★ Most Important for New Agents)**:
   - Detailed record of **what was wrong initially** (lack of controllers/MVC violation, `admin123` authentication backdoor bypass, incomplete project CRUD, broken redirects, missing `.env`).
   - Detailed record of **all changes made** (20 controllers created, 22 routes refactored into thin dispatchers, bcrypt hashing secured, input validation layer in `middleware/validate.js`, global error middleware, database seed password fix).
2. **[`md/progress.md`](md/progress.md)**:
   - Comprehensive system architecture, RBAC permissions matrix, 20 features mapped across Members A, B, C, and D, and the 21 database table schemas.
3. **[`md/CSE470_Demo_Guide.md`](md/CSE470_Demo_Guide.md)**:
   - Step-by-step instructions for demonstrating all 20 features during presentations and viva (click paths, sample input values, and technical talking points).
4. **[`md/CSE470_Project_Feature_Doc.md`](md/CSE470_Project_Feature_Doc.md)**:
   - Complete formal project feature documentation matching university submission requirements.
5. **[`md/PROJECT_ROADMAP.md`](md/PROJECT_ROADMAP.md)**:
   - Original 4-sprint milestone plan.

---

## 🚀 Quick Setup on a New Device

```bash
# 1. Clone the repository
git clone https://github.com/thinkiamparanoid2/CSE470-Group10.git
cd CSE470-Group10

# 2. Install dependencies
npm install

# 3. Create .env file from template
cp .env.example .env
# Ensure DB_HOST, DB_USER, DB_PASSWORD, DB_NAME match your local MySQL configuration

# 4. Import the database schema & seed data
mysql -u root -p < database/schema.sql

# 5. Start the server
npm start
# Or double-click start-mysql.bat and start-app.bat
```

Open your browser at **http://localhost:3000**

### Test Credentials (Pre-seeded):
- **SuperAdmin:** `admin@smarstruction.bd` / `admin123`
- **Project Manager:** `pm@smarstruction.bd` / `admin123`
- **Site Engineer:** `engineer@smarstruction.bd` / `admin123`
- **Vendor:** `vendor@bsrm.bd` / `admin123`
