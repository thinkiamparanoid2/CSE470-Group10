# 🏗️ SmartConstruct BD (Smarstruction)

**Course:** CSE470 — Software Engineering  
**Group:** 10  
**Domain:** Construction Project & Material Management System  
**Tech Stack:** Node.js + Express.js + Raw MySQL (`mysql2/promise`) + EJS + Custom CSS  
**Architecture:** Strict MVC (Model-View-Controller) — **No ORM**

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
