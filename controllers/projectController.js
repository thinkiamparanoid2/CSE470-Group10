const db = require('../config/db');
const { isRequired, isPositiveNumber, isValidDate, sanitize } = require('../middleware/validate');

// Project List
async function listProjects(req, res) {
    try {
        const [projects] = await db.query('SELECT * FROM projects ORDER BY created_at DESC');
        res.render('projects/index', { projects, title: 'Project Management' });
    } catch (err) {
        console.error('List Projects Error:', err);
        res.render('projects/index', { projects: [], title: 'Project Management', error: 'Failed to retrieve project list.' });
    }
}

// Show Create Project Form
function showCreateForm(req, res) {
    res.render('projects/create', { title: 'Create New Project', error: null });
}

// Create Project (Raw SQL with Validation)
async function createProject(req, res) {
    const name = sanitize(req.body.name);
    const location = sanitize(req.body.location);
    const budget = req.body.budget;
    const start_date = req.body.start_date;
    const target_completion_date = req.body.target_completion_date;

    // Validation
    if (!isRequired(name) || name.length < 2) {
        return res.render('error', { message: 'Validation Error: Project name is required and must be at least 2 characters.' });
    }
    if (budget && (!isPositiveNumber(budget) || parseFloat(budget) < 0)) {
        return res.render('error', { message: 'Validation Error: Project budget cannot be negative.' });
    }
    if (start_date && !isValidDate(start_date)) {
        return res.render('error', { message: 'Validation Error: Invalid project start date format.' });
    }
    if (target_completion_date && !isValidDate(target_completion_date)) {
        return res.render('error', { message: 'Validation Error: Invalid target completion date format.' });
    }
    if (start_date && target_completion_date && new Date(start_date) > new Date(target_completion_date)) {
        return res.render('error', { message: 'Validation Error: Start date cannot be after the target completion date.' });
    }

    try {
        await db.query(
            'INSERT INTO projects (name, location, budget, start_date, target_completion_date) VALUES (?, ?, ?, ?, ?)',
            [name, location || null, parseFloat(budget || 0.00), start_date || null, target_completion_date || null]
        );
        res.redirect('/projects');
    } catch (err) {
        console.error('Create Project Error:', err);
        res.render('error', { message: 'Database Error: Failed to create project.' });
    }
}

// Show Edit Project Form
async function showEditForm(req, res) {
    const projectId = parseInt(req.params.id, 10);
    if (isNaN(projectId)) {
        return res.render('error', { message: 'Invalid project ID.' });
    }

    try {
        const [projects] = await db.query('SELECT * FROM projects WHERE id = ?', [projectId]);
        if (projects.length === 0) {
            return res.render('error', { message: 'Project not found.' });
        }
        res.render('projects/edit', { project: projects[0], title: 'Edit Project' });
    } catch (err) {
        console.error('Show Edit Project Error:', err);
        res.render('error', { message: 'Database Error: Could not retrieve project information.' });
    }
}

// Update Project (Raw SQL with Validation)
async function updateProject(req, res) {
    const projectId = parseInt(req.params.id, 10);
    if (isNaN(projectId)) {
        return res.render('error', { message: 'Invalid project ID.' });
    }

    const name = sanitize(req.body.name);
    const location = sanitize(req.body.location);
    const budget = req.body.budget;
    const status = sanitize(req.body.status) || 'Ongoing';
    const start_date = req.body.start_date;
    const target_completion_date = req.body.target_completion_date;

    const validStatuses = ['Planning', 'Ongoing', 'Completed', 'On Hold'];

    // Validation
    if (!isRequired(name) || name.length < 2) {
        return res.render('error', { message: 'Validation Error: Project name is required.' });
    }
    if (!validStatuses.includes(status)) {
        return res.render('error', { message: 'Validation Error: Invalid project status.' });
    }
    if (budget && (!isPositiveNumber(budget) || parseFloat(budget) < 0)) {
        return res.render('error', { message: 'Validation Error: Budget cannot be negative.' });
    }
    if (start_date && !isValidDate(start_date)) {
        return res.render('error', { message: 'Validation Error: Invalid start date format.' });
    }
    if (target_completion_date && !isValidDate(target_completion_date)) {
        return res.render('error', { message: 'Validation Error: Invalid target completion date format.' });
    }
    if (start_date && target_completion_date && new Date(start_date) > new Date(target_completion_date)) {
        return res.render('error', { message: 'Validation Error: Start date cannot be after the target completion date.' });
    }

    try {
        await db.query(
            'UPDATE projects SET name = ?, location = ?, budget = ?, status = ?, start_date = ?, target_completion_date = ? WHERE id = ?',
            [name, location || null, parseFloat(budget || 0.00), status, start_date || null, target_completion_date || null, projectId]
        );
        res.redirect('/projects');
    } catch (err) {
        console.error('Update Project Error:', err);
        res.render('error', { message: 'Database Error: Could not update project.' });
    }
}

// Delete Project (Raw SQL with Error Handling)
async function deleteProject(req, res) {
    const projectId = parseInt(req.params.id, 10);
    if (isNaN(projectId)) {
        return res.render('error', { message: 'Invalid project ID.' });
    }

    try {
        await db.query('DELETE FROM projects WHERE id = ?', [projectId]);
        res.redirect('/projects');
    } catch (err) {
        console.error('Delete Project Error:', err);
        res.render('error', { message: 'Database Error: Cannot delete project because it has linked milestones, reports, labor logs, or BOQs.' });
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
        console.error('Progress Dashboard Error:', err);
        res.render('error', { message: 'Database Error: Failed to render progress dashboard.' });
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
