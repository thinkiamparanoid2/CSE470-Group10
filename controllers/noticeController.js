const db = require('../config/db');
const { isRequired, sanitize } = require('../middleware/validate');

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
        console.error('Show Notice Board Error:', err);
        res.render('notices/board', { notices: [], title: 'Internal Notice Board', error: 'Failed to load notices.' });
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
        res.render('notices/index', { notices, title: 'Notice Board CMS' });
    } catch (err) {
        console.error('List Notices CMS Error:', err);
        res.render('notices/index', { notices: [], title: 'Notice Board CMS', error: 'Failed to load notices list.' });
    }
}

// Show Create Notice Form
function showCreateForm(req, res) {
    res.render('notices/create', { title: 'Create New Notice', error: null });
}

// Create Notice (Raw SQL with Validation)
async function createNotice(req, res) {
    const title = sanitize(req.body.title);
    const content = sanitize(req.body.content);
    let priority = sanitize(req.body.priority) || 'Normal';
    if (priority === 'Urgent') priority = 'Emergency';
    const created_by = req.session.user.id;

    const validPriorities = ['Normal', 'High', 'Emergency'];

    // Validation
    if (!isRequired(title) || title.length < 3) {
        return res.render('error', { message: 'Validation Error: Notice title is required and must be at least 3 characters.' });
    }
    if (!isRequired(content) || content.length < 5) {
        return res.render('error', { message: 'Validation Error: Notice content must be at least 5 characters.' });
    }
    if (!validPriorities.includes(priority)) {
        return res.render('error', { message: 'Validation Error: Invalid notice priority level.' });
    }

    try {
        await db.query(
            'INSERT INTO notices (title, content, priority, created_by) VALUES (?, ?, ?, ?)',
            [title, content, priority, created_by]
        );
        res.redirect('/notices');
    } catch (err) {
        console.error('Create Notice Error:', err);
        res.render('error', { message: 'Database Error: Could not post notice.' });
    }
}

// Show Edit Notice Form
async function showEditForm(req, res) {
    const noticeId = parseInt(req.params.id, 10);
    if (isNaN(noticeId)) {
        return res.render('error', { message: 'Invalid notice ID.' });
    }

    try {
        const [notices] = await db.query('SELECT * FROM notices WHERE id = ?', [noticeId]);
        if (notices.length === 0) {
            return res.render('error', { message: 'Notice not found.' });
        }
        res.render('notices/edit', { notice: notices[0], title: 'Edit Notice' });
    } catch (err) {
        console.error('Show Edit Notice Form Error:', err);
        res.render('error', { message: 'Database Error: Failed to retrieve notice.' });
    }
}

// Update Notice (Raw SQL with Validation)
async function updateNotice(req, res) {
    const noticeId = parseInt(req.params.id, 10);
    if (isNaN(noticeId)) {
        return res.render('error', { message: 'Invalid notice ID.' });
    }

    const title = sanitize(req.body.title);
    const content = sanitize(req.body.content);
    let priority = sanitize(req.body.priority) || 'Normal';
    if (priority === 'Urgent') priority = 'Emergency';
    const validPriorities = ['Normal', 'High', 'Emergency'];

    // Validation
    if (!isRequired(title) || title.length < 3) {
        return res.render('error', { message: 'Validation Error: Notice title is required.' });
    }
    if (!isRequired(content) || content.length < 5) {
        return res.render('error', { message: 'Validation Error: Notice content must be at least 5 characters.' });
    }
    if (!validPriorities.includes(priority)) {
        return res.render('error', { message: 'Validation Error: Invalid priority level.' });
    }

    try {
        await db.query(
            'UPDATE notices SET title = ?, content = ?, priority = ? WHERE id = ?',
            [title, content, priority, noticeId]
        );
        res.redirect('/notices');
    } catch (err) {
        console.error('Update Notice Error:', err);
        res.render('error', { message: 'Database Error: Could not update notice.' });
    }
}

// Delete Notice (Raw SQL with Error Handling)
async function deleteNotice(req, res) {
    const noticeId = parseInt(req.params.id, 10);
    if (isNaN(noticeId)) {
        return res.render('error', { message: 'Invalid notice ID.' });
    }

    try {
        await db.query('DELETE FROM notices WHERE id = ?', [noticeId]);
        res.redirect('/notices');
    } catch (err) {
        console.error('Delete Notice Error:', err);
        res.render('error', { message: 'Database Error: Failed to delete notice.' });
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
