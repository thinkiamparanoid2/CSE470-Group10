const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { isAuthenticated, hasRole } = require('../middleware/auth');

// GET /projects/dashboard
router.get('/', isAuthenticated, async (req, res) => {
    try {
        // Fetch all projects
        const [projects] = await db.query('SELECT * FROM projects ORDER BY start_date ASC');
        
        // Fetch milestones for progress calculation
        const [milestones] = await db.query('SELECT project_id, status FROM milestones');
        
        // Calculate progress for each project
        projects.forEach(project => {
            const projectMilestones = milestones.filter(m => m.project_id === project.id);
            const total = projectMilestones.length;
            const completed = projectMilestones.filter(m => m.status === 'Completed').length;
            
            project.progress = total > 0 ? Math.round((completed / total) * 100) : 0;
            project.total_milestones = total;
            project.completed_milestones = completed;
            
            // Format dates for display
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
});

module.exports = router;
