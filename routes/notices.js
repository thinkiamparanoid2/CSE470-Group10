const express = require('express');
const router = express.Router();
const { isAuthenticated, hasRole } = require('../middleware/auth');
const noticeController = require('../controllers/noticeController');

// Member D: Notice / Announcement Board
router.get('/board', isAuthenticated, noticeController.showBoard);
router.get('/', isAuthenticated, hasRole('SuperAdmin', 'Project Manager'), noticeController.listNotices);
router.get('/create', isAuthenticated, hasRole('SuperAdmin', 'Project Manager'), noticeController.showCreateForm);
router.post('/create', isAuthenticated, hasRole('SuperAdmin', 'Project Manager'), noticeController.createNotice);
router.get('/edit/:id', isAuthenticated, hasRole('SuperAdmin', 'Project Manager'), noticeController.showEditForm);
router.post('/edit/:id', isAuthenticated, hasRole('SuperAdmin', 'Project Manager'), noticeController.updateNotice);
router.post('/delete/:id', isAuthenticated, hasRole('SuperAdmin', 'Project Manager'), noticeController.deleteNotice);

module.exports = router;
