const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const habitController = require('../controllers/habitController');

router.use('/', authController.checkLoggedIn)
router.get('/', habitController.getHabits);
router.post('/', habitController.createHabit);
router.delete('/:habitID', habitController.deleteHabit);
router.put('/:habitID', habitController.updateHabit);

module.exports = router;