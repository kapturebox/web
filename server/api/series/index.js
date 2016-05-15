'use strict';

var express = require('express');
var controller = require('./series.controller');

var router = express.Router();

router.get( '/', controller.index );
router.put( '/', controller.addSeries );

router.get(    '/:id', controller.getSeriesInfo );
router.delete( '/:id', controller.deleteSeries );


module.exports = router;
