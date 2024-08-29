var express = require('express');
var router = express.Router();
var homePageController = require('../controller/homePageController');


router.get('/',homePageController.getHomePage);

module.exports = router;