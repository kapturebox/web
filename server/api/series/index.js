'use strict';

var express = require('express');
var controller = require('./series.controller');

var router = express.Router();

router.get( '/', controller.index );
router.get( '/:id', controller.getSeriesInfo );
router.put( '/', controller.addSeries );

module.exports = router;
