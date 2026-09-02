const express = require('express');
const router = express.Router();
const { isAuthenticated, hasRole } = require('../middleware/auth');
const projectController = require('../controllers/projectController');

// Project Management (enhanced with full CRUD)
// Internal site/project data — hidden from Vendor in the navbar, so gate the route too.
router.get('/', isAuthenticated, hasRole('SuperAdmin', 'Project Manager', 'Site Engineer'), projectController.listProjects);
router.get('/create', isAuthenticated, hasRole('SuperAdmin', 'Project Manager'), projectController.showCreateForm);
router.post('/create', isAuthenticated, hasRole('SuperAdmin', 'Project Manager'), projectController.createProject);
router.get('/edit/:id', isAuthenticated, hasRole('SuperAdmin', 'Project Manager'), projectController.showEditForm);
router.post('/edit/:id', isAuthenticated, hasRole('SuperAdmin', 'Project Manager'), projectController.updateProject);
router.post('/delete/:id', isAuthenticated, hasRole('SuperAdmin', 'Project Manager'), projectController.deleteProject);

module.exports = router;
