const db = require('../config/db');
const { isRequired, isValidDate, sanitize } = require('../middleware/validate');

// Member C: Milestone Tracker List
async function listMilestones(req, res) {
    try {
        const [projects] = await db.query('SELECT * FROM projects');
        const [milestones] = await db.query(`
            SELECT m.*, p.name AS project_name 
            FROM milestones m 
            JOIN projects p ON m.project_id = p.id 
            ORDER BY m.due_date ASC
        `);
        res.render('milestones/index', { projects, milestones, title: 'Milestone Tracker' });
    } catch (err) {
        console.error('List Milestones Error:', err);
        res.render('milestones/index', { projects: [], milestones: [], title: 'Milestone Tracker' });
    }
}

// Create Milestone (Raw SQL with Validation)
async function createMilestone(req, res) {
    const project_id = parseInt(req.body.project_id, 10);
    const title = sanitize(req.body.title);
    const description = sanitize(req.body.description);
    const due_date = req.body.due_date;

    // Validation
    if (isNaN(project_id)) {
        return res.render('error', { message: 'Validation Error: Please select a valid project for the milestone.' });
    }
    if (!isRequired(title) || title.length < 2) {
        return res.render('error', { message: 'Validation Error: Milestone title is required.' });
    }
    if (!due_date || !isValidDate(due_date)) {
        return res.render('error', { message: 'Validation Error: A valid milestone due date is required.' });
    }

    try {
        await db.query(
            'INSERT INTO milestones (project_id, title, description, due_date) VALUES (?, ?, ?, ?)',
            [project_id, title, description || null, due_date]
        );
        res.redirect('/milestones');
    } catch (err) {
        console.error('Create Milestone Error:', err);
        res.render('error', { message: 'Database Error: Could not save milestone.' });
    }
}

// Show Edit Milestone Form
async function showEditForm(req, res) {
    const milestoneId = parseInt(req.params.id, 10);
    if (isNaN(milestoneId)) {
        return res.render('error', { message: 'Invalid milestone ID.' });
    }

    try {
        const [milestones] = await db.query('SELECT * FROM milestones WHERE id = ?', [milestoneId]);
        if (milestones.length === 0) {
            return res.render('error', { message: 'Milestone not found.' });
        }
        res.render('milestones/edit', { milestone: milestones[0], title: 'Edit Milestone' });
    } catch (err) {
        console.error('Show Edit Milestone Error:', err);
        res.render('error', { message: 'Database Error: Could not retrieve milestone.' });
    }
}

// Update Milestone (Raw SQL with Validation)
async function updateMilestone(req, res) {
    const milestoneId = parseInt(req.params.id, 10);
    if (isNaN(milestoneId)) {
        return res.render('error', { message: 'Invalid milestone ID.' });
    }

    const title = sanitize(req.body.title);
    const description = sanitize(req.body.description);
    const due_date = req.body.due_date;
    const status = sanitize(req.body.status);

    const validStatuses = ['Pending', 'In Progress', 'Completed'];

    // Validation
    if (!isRequired(title) || title.length < 2) {
        return res.render('error', { message: 'Validation Error: Milestone title is required.' });
    }
    if (due_date && !isValidDate(due_date)) {
        return res.render('error', { message: 'Validation Error: Invalid due date format.' });
    }
    if (!validStatuses.includes(status)) {
        return res.render('error', { message: 'Validation Error: Invalid milestone status.' });
    }

    try {
        await db.query(
            'UPDATE milestones SET title = ?, description = ?, due_date = ?, status = ? WHERE id = ?',
            [title, description || null, due_date || null, status, milestoneId]
        );
        res.redirect('/milestones');
    } catch (err) {
        console.error('Update Milestone Error:', err);
        res.render('error', { message: 'Database Error: Could not update milestone.' });
    }
}

// Delete Milestone (Raw SQL with Error Handling)
async function deleteMilestone(req, res) {
    const milestoneId = parseInt(req.params.id, 10);
    if (isNaN(milestoneId)) {
        return res.render('error', { message: 'Invalid milestone ID.' });
    }

    try {
        await db.query('DELETE FROM milestones WHERE id = ?', [milestoneId]);
        res.redirect('/milestones');
    } catch (err) {
        console.error('Delete Milestone Error:', err);
        res.render('error', { message: 'Database Error: Could not delete milestone.' });
    }
}

module.exports = {
    listMilestones,
    createMilestone,
    showEditForm,
    updateMilestone,
    deleteMilestone
};
