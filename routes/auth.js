const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Login
router.get('/login', authController.showLogin);
router.post('/login', authController.processLogin);

// Register
router.get('/register', authController.showRegister);
router.post('/register', authController.processRegister);

// Logout
router.get('/logout', authController.logout);

module.exports = router;
