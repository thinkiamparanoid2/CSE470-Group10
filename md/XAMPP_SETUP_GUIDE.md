# 💻 Laptop / XAMPP Environment Setup Guide

**Project:** SmartConstruct BD (SmartConstruction) — CSE470 Group 10  
**Target Environment:** Windows Laptop running **XAMPP** for MySQL.

> **Setup Notes:**  
> When setting up this project on a laptop where XAMPP is used, follow the exact steps below in order. Do not install a separate MySQL server if XAMPP is already installed.

---

## ⚡ Step-by-Step Setup

### Step 1: Ensure MySQL is Running via XAMPP

- **Option A (User GUI):**  
  Open **XAMPP Control Panel** and click **Start** next to **MySQL** (and optionally **Apache**).
- **Option B (Command Line):**  
  ```powershell
  # Check if MySQL is listening on standard port 3306
  Test-NetConnection -ComputerName localhost -Port 3306
  
  # If not running, start MySQL daemon from XAMPP directly:
  Start-Process "C:\xampp\mysql\bin\mysqld.exe" -ArgumentList "--defaults-file=C:\xampp\mysql\bin\my.ini" -WindowStyle Hidden
  ```

---

### Step 2: Create the `.env` Configuration File

Create a file named `.env` in the root of the project directory (`CSE470-Group10/.env`) with the following contents:

```env
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=smartconstruct
SESSION_SECRET=smartconstruct_secret_key_cse470
```

> **Note:** In XAMPP, the default MySQL user is `root` with **no password** (blank). If the user configured a custom MySQL root password in XAMPP, set `DB_PASSWORD=their_password`.

#### PowerShell Command (Alternative):
```powershell
Set-Content -Path ".env" -Value @"
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=smartconstruct
SESSION_SECRET=smartconstruct_secret_key_cse470
"@
```

---

### Step 3: Import Database Schema & Seed Data

Import the `database/schema.sql` file into XAMPP MySQL. This will create the `smartconstruct` database, 21 relational tables, and seed accounts with bcrypt-hashed passwords.

- **Option A (Using phpMyAdmin GUI):**
  1. Open browser at: **http://localhost/phpmyadmin**
  2. Click the **Import** tab at the top.
  3. Click **Choose File** and select `database/schema.sql` from the project directory.
  4. Scroll to the bottom and click **Import** (or **Go**).

- **Option B (Command Line):**
  ```powershell
  Get-Content "database\schema.sql" | & "C:\xampp\mysql\bin\mysql.exe" -u root
  ```
  *(If MySQL is in system PATH, simply run: `Get-Content database\schema.sql | mysql -u root`)*

---

### Step 4: Install Dependencies

In the project root directory, run:
```powershell
npm install
```

---

### Step 5: Start the Application

```powershell
npm start
```
*(Or run `node server.js`)*

Expected console output:
```
🚀 SmartConstruction Server running on http://localhost:3000
✅ MySQL Database connected successfully!
```

---

## 🔑 Pre-Seeded Test Credentials

All seed accounts are pre-configured with password **`admin123`**:

| Role | Email | Password |
| :--- | :--- | :--- |
| **SuperAdmin** | `admin@smartconstruction.bd` | `admin123` |
| **Project Manager** | `pm@smartconstruction.bd` | `admin123` |
| **Site Engineer** | `engineer@smartconstruction.bd` | `admin123` |
| **Vendor** | `vendor@bsrm.bd` | `admin123` |

---

## 🔍 Automated Verification

To verify the setup automatically in PowerShell, run:

```powershell
node -e "const db = require('./config/db'); db.query('SELECT count(*) as count FROM users').then(([r]) => { console.log('DB OK! User count:', r[0].count); process.exit(0); }).catch(e => { console.error('DB FAIL:', e.message); process.exit(1); });"
```

If it prints `DB OK! User count: 4`, the environment setup is 100% complete and working.
