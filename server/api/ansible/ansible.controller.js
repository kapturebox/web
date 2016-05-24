'use strict';

var _               = require('lodash');
var util            = require('util');
var exec            = require('child_process').exec;
var config          = require('../../config/environment');
var run_ansible     = require('../../components/run_ansible');


// Get list of ansibles
exports.index = function( req, res, next ) {
  run_ansible().then(function( stdout ) {
    return res.status(200).send( stdout );
  }).catch(function( err ) {
    config.logger.error('error:', err);
    return next(new Error( err ));
  });
};
