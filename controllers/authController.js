const bcrypt = require('bcryptjs');
const db = require('../config/db');
const { isValidEmail, isRequired, sanitize } = require('../middleware/validate');

// Render Login Page
function showLogin(req, res) {
    res.render('login', { error: null, title: 'Login | SmartConstruction' });
}

// Process Login (Raw SQL - No ORM with Validation & Error Handling)
async function processLogin(req, res) {
    const email = sanitize(req.body.email);
    const password = req.body.password;

    // Input Validation
    if (!isRequired(email) || !isRequired(password)) {
        return res.render('login', { error: 'Both email and password are required.', title: 'Login | SmartConstruction' });
    }

    if (!isValidEmail(email)) {
        return res.render('login', { error: 'Please enter a valid email address format.', title: 'Login | SmartConstruction' });
    }

    try {
        const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (users.length === 0) {
            return res.render('login', { error: 'Invalid email or password.', title: 'Login | SmartConstruction' });
        }
        const user = users[0];
        const match = await bcrypt.compare(password, user.password);

        if (match) {
            req.session.user = {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            };
            const returnTo = req.session.returnTo || '/dashboard';
            delete req.session.returnTo;
            return res.redirect(returnTo);
        }

        res.render('login', { error: 'Invalid email or password.', title: 'Login | SmartConstruction' });
    } catch (err) {
        console.error('Auth Login Error:', err);
        res.render('login', { error: 'An unexpected database error occurred during login. Please try again.', title: 'Login | SmartConstruction' });
    }
}

// Render Register Page
function showRegister(req, res) {
    res.render('register', { error: null, title: 'Register | SmartConstruction' });
}

// Process Registration (Raw SQL with Validation & Error Handling)
async function processRegister(req, res) {
    const name = sanitize(req.body.name);
    const email = sanitize(req.body.email);
    const password = req.body.password;
    const role = sanitize(req.body.role) || 'Site Engineer';
    const phone = sanitize(req.body.phone);

    // Validation
    // Public self-registration may only grant base operational roles.
    // SuperAdmin / Project Manager accounts must be provisioned by an existing SuperAdmin.
    const validRoles = ['Site Engineer', 'Vendor'];
    if (!isRequired(name) || name.length < 2) {
        return res.render('register', { error: 'Full Name must be at least 2 characters.', title: 'Register' });
    }
    if (!isValidEmail(email)) {
        return res.render('register', { error: 'Please provide a valid email address.', title: 'Register' });
    }
    if (!password || password.length < 6) {
        return res.render('register', { error: 'Password must be at least 6 characters long.', title: 'Register' });
    }
    if (!validRoles.includes(role)) {
        return res.render('register', { error: 'Invalid user role selected.', title: 'Register' });
    }

    try {
        const [existing] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
        if (existing.length > 0) {
            return res.render('register', { error: 'An account with this email address already exists.', title: 'Register' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        await db.query(
            'INSERT INTO users (name, email, password, role, phone) VALUES (?, ?, ?, ?, ?)',
            [name, email, hashedPassword, role, phone || null]
        );
        res.redirect('/login');
    } catch (err) {
        console.error('Auth Register Error:', err);
        res.render('register', { error: 'Failed to create user account. Please check your data and try again.', title: 'Register' });
    }
}

// Logout
function logout(req, res) {
    req.session.destroy((err) => {
        if (err) {
            console.error('Session destruction error:', err);
        }
        res.redirect('/login');
    });
}

module.exports = {
    showLogin,
    processLogin,
    showRegister,
    processRegister,
    logout
};
