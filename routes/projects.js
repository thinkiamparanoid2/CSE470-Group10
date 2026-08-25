const express = require('express');
const router = express.Router();
const { isAuthenticated, hasRole } = require('../middleware/auth');
const projectController = require('../controllers/projectController');

// Project Management (enhanced with full CRUD)
router.get('/', isAuthenticated, projectController.listProjects);
router.get('/create', isAuthenticated, hasRole('SuperAdmin', 'Project Manager'), projectController.showCreateForm);
router.post('/create', isAuthenticated, hasRole('SuperAdmin', 'Project Manager'), projectController.createProject);
router.get('/edit/:id', isAuthenticated, hasRole('SuperAdmin', 'Project Manager'), projectController.showEditForm);
router.post('/edit/:id', isAuthenticated, hasRole('SuperAdmin', 'Project Manager'), projectController.updateProject);
router.post('/delete/:id', isAuthenticated, hasRole('SuperAdmin', 'Project Manager'), projectController.deleteProject);

module.exports = router;
