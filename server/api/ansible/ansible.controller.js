'use strict';

var _      = require('lodash');
var util   = require('util');
var exec   = require('child_process').exec;
var config = require('../../config/environment');


// Get list of ansibles
exports.index = function( req, res, next ) {
  var command = util.format( 'flock /tmp/ansiblerunlock ./server/run-ansible-local.sh %s %s', config.env, config.settingsFileStore );

  exec( command, function( exitCode, stdout, stderr ) {
    config.logger.debug( 'ran "%s": exitCode: %s, stdout: %s, stderr: %s', command, exitCode, stdout, stderr );
    if( exitCode === null ) {
      return res.status(200).send({ stdout: stdout });
    } else {
      return next(new Error( {stdout: stdout, stderr: stderr} ));
    }
  });
};
