'use strict';

var express = require('express');
var controller = require('./settings.controller');

var router = express.Router();

router.post('/', controller.postSettings);
router.get('/', controller.getSettings);

module.exports = router;
