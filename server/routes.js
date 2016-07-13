/**
 * Main application routes
 */

'use strict';

var errors = require('./components/errors');
var path = require('path');

module.exports = function(app) {

  // Insert routes below
  app.use('/api/remote', require('./api/remote'));
  app.use('/api/plugins', require('./api/plugin'));
  app.use('/api/ansible',  require('./api/ansible'));
  app.use('/api/series',   require('./api/series'));
  app.use('/api/download', require('./api/download'));
  app.use('/api/search',   require('./api/search'));
  app.use('/api/settings', require('./api/settings'));

  // All undefined asset or api routes should return a 404
  app.route('/:url(api|auth|components|app|bower_components|assets)/*')
   .get(errors[404]);

  // All other routes should redirect to the index.html
  app.route('/*')
    .get(function(req, res) {
      res.sendFile(path.resolve(app.get('appPath') + '/index.html'));
    });
};
