const db = require('../config/db');

// Public Notice Board (all authenticated users)
async function showBoard(req, res) {
    try {
        const [notices] = await db.query(`
            SELECT notices.*, users.name as author 
            FROM notices 
            LEFT JOIN users ON notices.created_by = users.id 
            ORDER BY created_at DESC
        `);
        res.render('notices/board', { notices, title: 'Internal Notice Board' });
    } catch (err) {
        console.error(err);
        res.render('notices/board', { notices: [], title: 'Internal Notice Board' });
    }
}

// Admin CMS List
async function listNotices(req, res) {
    try {
        const [notices] = await db.query(`
            SELECT notices.*, users.name as author 
            FROM notices 
            LEFT JOIN users ON notices.created_by = users.id 
            ORDER BY created_at DESC
        `);
        res.render('notices/index', { notices, title: 'Notice Board CMS | Member D' });
    } catch (err) {
        console.error(err);
        res.render('notices/index', { notices: [], title: 'Notice Board CMS' });
    }
}

// Show Create Notice Form
function showCreateForm(req, res) {
    res.render('notices/create', { title: 'Create New Notice' });
}

// Create Notice (Raw SQL)
async function createNotice(req, res) {
    const { title, content, priority } = req.body;
    const created_by = req.session.user.id;
    try {
        await db.query(
            'INSERT INTO notices (title, content, priority, created_by) VALUES (?, ?, ?, ?)',
            [title, content, priority || 'Normal', created_by]
        );
        res.redirect('/notices');
    } catch (err) {
        console.error(err);
        res.render('notices/create', { error: 'Failed to create notice', title: 'Create New Notice' });
    }
}

// Show Edit Notice Form
async function showEditForm(req, res) {
    try {
        const [notices] = await db.query('SELECT * FROM notices WHERE id = ?', [req.params.id]);
        if (notices.length === 0) return res.redirect('/notices');
        res.render('notices/edit', { notice: notices[0], title: 'Edit Notice' });
    } catch (err) {
        console.error(err);
        res.redirect('/notices');
    }
}

// Update Notice (Raw SQL)
async function updateNotice(req, res) {
    const { title, content, priority } = req.body;
    try {
        await db.query(
            'UPDATE notices SET title = ?, content = ?, priority = ? WHERE id = ?',
            [title, content, priority || 'Normal', req.params.id]
        );
        res.redirect('/notices');
    } catch (err) {
        console.error(err);
        res.redirect('/notices');
    }
}

// Delete Notice (Raw SQL)
async function deleteNotice(req, res) {
    try {
        await db.query('DELETE FROM notices WHERE id = ?', [req.params.id]);
        res.redirect('/notices');
    } catch (err) {
        console.error(err);
        res.redirect('/notices');
    }
}

module.exports = {
    showBoard,
    listNotices,
    showCreateForm,
    createNotice,
    showEditForm,
    updateNotice,
    deleteNotice
};
