const db = require('../config/db');

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
        res.render('milestones/index', { projects, milestones, title: 'Milestone Tracker | Member C' });
    } catch (err) {
        console.error(err);
        res.render('milestones/index', { projects: [], milestones: [], title: 'Milestone Tracker' });
    }
}

// Create Milestone (Raw SQL)
async function createMilestone(req, res) {
    const { project_id, title, description, due_date } = req.body;
    try {
        await db.query(
            'INSERT INTO milestones (project_id, title, description, due_date) VALUES (?, ?, ?, ?)',
            [project_id, title, description, due_date]
        );
        res.redirect('/milestones');
    } catch (err) {
        console.error(err);
        res.redirect('/milestones');
    }
}

// Show Edit Milestone Form
async function showEditForm(req, res) {
    try {
        const [milestones] = await db.query('SELECT * FROM milestones WHERE id = ?', [req.params.id]);
        if (milestones.length === 0) return res.redirect('/milestones');
        res.render('milestones/edit', { milestone: milestones[0], title: 'Edit Milestone' });
    } catch (err) {
        console.error(err);
        res.redirect('/milestones');
    }
}

// Update Milestone (Raw SQL)
async function updateMilestone(req, res) {
    const { title, description, due_date, status } = req.body;
    try {
        await db.query(
            'UPDATE milestones SET title = ?, description = ?, due_date = ?, status = ? WHERE id = ?',
            [title, description, due_date, status, req.params.id]
        );
        res.redirect('/milestones');
    } catch (err) {
        console.error(err);
        res.redirect('/milestones');
    }
}

// Delete Milestone (Raw SQL)
async function deleteMilestone(req, res) {
    try {
        await db.query('DELETE FROM milestones WHERE id = ?', [req.params.id]);
        res.redirect('/milestones');
    } catch (err) {
        console.error(err);
        res.redirect('/milestones');
    }
}

module.exports = {
    listMilestones,
    createMilestone,
    showEditForm,
    updateMilestone,
    deleteMilestone
};
