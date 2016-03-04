'use strict';

var express = require('express');
var controller = require('./source.controller');

var router = express.Router();

router.get('/', controller.getSources);
router.put('/', controller.putSource);
router.get('/list-entries', controller.listSourceEntries);
router.delete('/', controller.deleteSource);


module.exports = router;
