var express = require('express');
var router = express.Router();
const indexController = require('../controllers/indexController');

/* GET home page. */
router.get('/', indexController.getHelloWorld);
router.get('/error', indexController.getErrorMessageTest);

module.exports = router;
