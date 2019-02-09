/**
 * Express configuration
 */

'use strict';

var express = require('express');
var favicon = require('serve-favicon');
var compression = require('compression');
var bodyParser = require('body-parser');
var path = require('path');
var config = require('./environment');
var winstonExpress = require('express-winston');

module.exports = function(app) {
  var env = app.get('env');

  app.set('views', config.root + '/server/views');
  app.engine('html', require('ejs').renderFile);
  app.set('view engine', 'html');
  app.use(compression());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(
    winstonExpress.logger({
      winstonInstance: config.logger,
      meta: false,
      expressFormat: true,
      colorize: true
    })
  );

  if ('production' === env || 'docker' === env ) {
    // app.use(favicon(path.join(config.root, 'public', 'favicon.ico')));
    app.use(express.static(path.join(config.root, 'public')));
    app.set('appPath', path.join(config.root, 'public'));
    app.set('x-powered-by', false);
  } else {
    app.use(require('connect-livereload')());
    app.use(express.static(path.join(config.root, '.tmp')));
    app.use(express.static(path.join(config.root, 'client')));
    app.set('appPath', path.join(config.root, 'client'));
  }

  require('../routes')(app);

  app.use(
    winstonExpress.errorLogger({
      winstonInstance: config.logger,
      json: true
    })
  );

};
