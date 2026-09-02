# 🏗️ SmartConstruction

**Course:** CSE470 — Software Engineering
**Group:** 10
**Domain:** Construction Project & Material Management System
**Tech Stack:** Node.js + Express.js + Raw MySQL (`mysql2/promise`) + EJS + Custom CSS
**Architecture:** Strict MVC (Model-View-Controller) — **No ORM**

This is a standalone **Node.js/Express** application. It only needs MySQL from
XAMPP — it does **not** run through Apache or PHP, and it does **not** need to
live inside XAMPP's `htdocs` folder (though it's fine if it does).

---

## ✅ Prerequisites

| Requirement | Notes |
|---|---|
| **Node.js** (v18 or newer) | Check with `node -v`. Download from [nodejs.org](https://nodejs.org/) if missing. |
| **XAMPP** (with MySQL) | Only the **MySQL** module is needed — Apache/PHP are not used by this app. |
| **Git** | To clone the repository. |

---

## 🚀 Setup — Step by Step

### 1. Clone the repository

```bash
git clone https://github.com/zubayer99/CSE470-Group10.git
cd CSE470-Group10
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start MySQL (from XAMPP)

Open the **XAMPP Control Panel** and click **Start** next to **MySQL**.

> You do *not* need to start Apache — this app doesn't use it.

If MySQL won't start, another MySQL service (e.g. a standalone MySQL Server,
or a previous XAMPP instance) is likely already holding port `3306`. Stop
that other service first, or change the port in `C:\xampp\mysql\bin\my.ini`
and in this project's `.env` to match.

### 4. Create your `.env` file

```bash
cp .env.example .env
```

Open `.env` and confirm it matches XAMPP's **default** MySQL settings:

```env
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=smartconstruct
SESSION_SECRET=smartconstruct_secret_key_cse470
```

XAMPP's MySQL ships with the `root` user and **no password** by default —
leave `DB_PASSWORD` blank unless you've deliberately set one yourself. This
`.env` file is how the app "connects" to the database; `config/db.js` reads
these exact values to open the connection pool. If you get an "Access
denied" error later, this file is the first thing to check.

### 5. Import the database schema

The XAMPP install of MySQL is **not** added to your system `PATH` by
default, so plain `mysql` may not be a recognized command. Use the full
path to XAMPP's `mysql.exe` instead. Run this from the project's root
folder (where `database/schema.sql` lives):

**Windows (Command Prompt / PowerShell):**
```bash
"C:\xampp\mysql\bin\mysql.exe" -u root < database/schema.sql
```

**macOS/Linux (typical XAMPP path):**
```bash
/opt/lampp/bin/mysql -u root < database/schema.sql
```

Don't add `-p` — the default XAMPP root account has no password, and `-p`
will make the command wait forever for one you never set. The script
creates the `smartconstruct` database itself (dropping it first if it
already exists) and seeds it with demo data, so there's no separate
"create the database" step.

To verify it worked, you can peek at the row count for one table:
```bash
"C:\xampp\mysql\bin\mysql.exe" -u root smartconstruct -e "SELECT COUNT(*) FROM users;"
```
This should return `4` (the seeded demo accounts).

### 6. Start the server

```bash
npm start
```

You should see:
```
🚀 SmartConstruction Server running on http://localhost:3000
✅ MySQL Database connected successfully!
```

If the second line doesn't appear, MySQL isn't running or your `.env`
values don't match — see Troubleshooting below.

### 7. Open it in your browser

**http://localhost:3000**

---

## 🔑 Test Credentials (Pre-seeded)

| Role | Email | Password |
|---|---|---|
| SuperAdmin | `admin@smartconstruction.bd` | `admin123` |
| Project Manager | `pm@smartconstruction.bd` | `admin123` |
| Site Engineer | `engineer@smartconstruction.bd` | `admin123` |
| Vendor | `vendor@bsrm.bd` | `admin123` |

---

## 🛠️ Convenience Scripts (Windows)

- **`start-mysql.bat`** — starts XAMPP's MySQL from the command line (same
  effect as clicking "Start" on MySQL in the XAMPP Control Panel).
- **`start-app.bat`** — runs `npm start` from wherever you cloned the repo.

Both assume the standard `C:\xampp` install location. If your XAMPP lives
somewhere else, just use the XAMPP Control Panel directly instead.

---

## 🩺 Troubleshooting

| Symptom | Likely cause / fix |
|---|---|
| `'mysql' is not recognized...` | Use the full path: `"C:\xampp\mysql\bin\mysql.exe"` instead of plain `mysql`. |
| `Access denied for user 'root'@'localhost'` | Your `.env` `DB_PASSWORD` doesn't match your MySQL root password. XAMPP's default is blank. |
| Server starts but no `✅ MySQL Database connected` line | MySQL isn't running — start it from the XAMPP Control Panel first. |
| `Error: listen EADDRINUSE :::3000` | Something else is already using port 3000. Either stop it, or change `PORT` in `.env`. |
| MySQL won't start in XAMPP | Port `3306` is already in use by another MySQL instance. Stop the other one, or change the port in `C:\xampp\mysql\bin\my.ini` and in `.env` to match. |
| Login page loads but every login fails | Confirm step 5 actually seeded data — re-run the schema import if `SELECT COUNT(*) FROM users;` returns `0`. |

---

*Maintained by CSE470 Group 10.*
