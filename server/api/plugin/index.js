'use strict';

var express = require('express');
var controller = require('./plugin.controller');

var router = express.Router();

router.get( '/', controller.index );
router.get( '/:plugin_id', controller.get );
router.put( '/:plugin_id', controller.put );

module.exports = router;
