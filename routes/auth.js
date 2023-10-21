const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');


router.post('/signup', authController.getUser, authController.signup);
router.post('/login', authController.getUser, authController.login);
router.get('/login', authController.getLoginStatus);
router.delete('/logout', authController.logout);

module.exports = router;