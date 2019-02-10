/**
 * Main application routes
 */

'use strict';

var errors = require('./components/errors');
var path = require('path');

module.exports = function(app) {
  // config endpoint to allow for setting of vars via environment
  app.route('/config')
    .get((req, res) => {
      var ret = {};

      Object
        .keys(process.env)
        .filter(e => ['SERVER_ENDPOINT'].includes(e))
        .forEach(e => ret[e] = process.env[e]);

      res.status(200).json(ret);
    })

  // All undefined asset or api routes should return a 404
  app.route('/:url(api|auth|components|app|bower_components|assets)/*')
   .get(errors[404]);

  // All other routes should redirect to the index.html
  app.route('/*')
    .get(function(req, res) {
      res.sendFile(path.resolve(app.get('appPath') + '/index.html'));
    });
};
