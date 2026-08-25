const db = require('../config/db');

// Project List (NEW - was missing)
async function listProjects(req, res) {
    try {
        const [projects] = await db.query('SELECT * FROM projects ORDER BY created_at DESC');
        res.render('projects/index', { projects, title: 'Project Management' });
    } catch (err) {
        console.error(err);
        res.render('projects/index', { projects: [], title: 'Project Management' });
    }
}

// Show Create Project Form
function showCreateForm(req, res) {
    res.render('projects/create', { title: 'Create New Project' });
}

// Create Project (Raw SQL)
async function createProject(req, res) {
    const { name, location, budget, start_date, target_completion_date } = req.body;
    try {
        await db.query(
            'INSERT INTO projects (name, location, budget, start_date, target_completion_date) VALUES (?, ?, ?, ?, ?)',
            [name, location, budget || 0.00, start_date, target_completion_date]
        );
        res.redirect('/projects');
    } catch (err) {
        console.error(err);
        res.render('projects/create', { error: 'Failed to create project', title: 'Create New Project' });
    }
}

// Show Edit Project Form (NEW)
async function showEditForm(req, res) {
    try {
        const [projects] = await db.query('SELECT * FROM projects WHERE id = ?', [req.params.id]);
        if (projects.length === 0) return res.redirect('/projects');
        res.render('projects/edit', { project: projects[0], title: 'Edit Project' });
    } catch (err) {
        console.error(err);
        res.redirect('/projects');
    }
}

// Update Project (Raw SQL) (NEW)
async function updateProject(req, res) {
    const { name, location, budget, status, start_date, target_completion_date } = req.body;
    try {
        await db.query(
            'UPDATE projects SET name = ?, location = ?, budget = ?, status = ?, start_date = ?, target_completion_date = ? WHERE id = ?',
            [name, location, budget || 0.00, status, start_date, target_completion_date, req.params.id]
        );
        res.redirect('/projects');
    } catch (err) {
        console.error(err);
        res.redirect('/projects');
    }
}

// Delete Project (Raw SQL) (NEW)
async function deleteProject(req, res) {
    try {
        await db.query('DELETE FROM projects WHERE id = ?', [req.params.id]);
        res.redirect('/projects');
    } catch (err) {
        console.error(err);
        res.redirect('/projects');
    }
}

// Project Progress Dashboard (Gantt-lite) - Member C
async function progressDashboard(req, res) {
    try {
        const [projects] = await db.query('SELECT * FROM projects ORDER BY start_date ASC');
        const [milestones] = await db.query('SELECT project_id, status FROM milestones');

        projects.forEach(project => {
            const projectMilestones = milestones.filter(m => m.project_id === project.id);
            const total = projectMilestones.length;
            const completed = projectMilestones.filter(m => m.status === 'Completed').length;

            project.progress = total > 0 ? Math.round((completed / total) * 100) : 0;
            project.total_milestones = total;
            project.completed_milestones = completed;

            project.formatted_start = project.start_date ? new Date(project.start_date).toLocaleDateString() : 'N/A';
            project.formatted_end = project.target_completion_date ? new Date(project.target_completion_date).toLocaleDateString() : 'N/A';
        });

        res.render('projects/dashboard', {
            title: 'Project Progress Dashboard',
            user: req.session.user,
            projects: projects
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
}

module.exports = {
    listProjects,
    showCreateForm,
    createProject,
    showEditForm,
    updateProject,
    deleteProject,
    progressDashboard
};
