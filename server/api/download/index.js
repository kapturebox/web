'use strict';

var express = require('express');
var controller = require('./download.controller');

var router = express.Router();

router.put('/', controller.addDownload);
router.get('/', controller.getDownloads);

module.exports = router;
