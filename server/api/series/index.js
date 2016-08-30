'use strict';

var express = require('express');
var controller = require('./series.controller');

var router = express.Router();


router.get( '/', controller.index );

// takes an item in body
router.put( '/',    controller.addSeries );
router.delete( '/', controller.deleteSeries );

router.get( '/source/:pluginId/series/:showId', controller.getSeriesInfo );


module.exports = router;
