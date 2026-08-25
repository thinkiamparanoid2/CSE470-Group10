const bcrypt = require('bcryptjs');
const db = require('../config/db');

// Render Login Page
function showLogin(req, res) {
    res.render('login', { error: null, title: 'Login | Smarstruction' });
}

// Process Login (Raw SQL - No ORM)
async function processLogin(req, res) {
    const { email, password } = req.body;
    try {
        const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (users.length === 0) {
            return res.render('login', { error: 'Invalid email or password', title: 'Login | Smarstruction' });
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

        res.render('login', { error: 'Invalid email or password', title: 'Login | Smarstruction' });
    } catch (err) {
        console.error(err);
        res.render('login', { error: 'Database error occurred', title: 'Login | Smarstruction' });
    }
}

// Render Register Page
function showRegister(req, res) {
    res.render('register', { error: null, title: 'Register | Smarstruction' });
}

// Process Registration (Raw SQL - No ORM)
async function processRegister(req, res) {
    const { name, email, password, role, phone } = req.body;
    try {
        const [existing] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
        if (existing.length > 0) {
            return res.render('register', { error: 'Email already exists', title: 'Register' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        await db.query(
            'INSERT INTO users (name, email, password, role, phone) VALUES (?, ?, ?, ?, ?)',
            [name, email, hashedPassword, role || 'Site Engineer', phone]
        );
        res.redirect('/login');
    } catch (err) {
        console.error(err);
        res.render('register', { error: 'Failed to create user account', title: 'Register' });
    }
}

// Logout
function logout(req, res) {
    req.session.destroy(() => {
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
