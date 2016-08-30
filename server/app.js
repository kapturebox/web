/**
 * Main application file
 */

'use strict';

// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var express = require('express');
var config = require('./config/environment');


// Setup server
var app = express();
var server = require('http').createServer( app );

require('./config/express')( app );
require('./makedirs')();

// Start server
server.listen(config.port, config.ip, function () {
  config.logger.info('Express server listening on http://%s:%d, in %s mode', config.ip, config.port, app.get('env'));
});

// Expose app
exports = module.exports = app;
