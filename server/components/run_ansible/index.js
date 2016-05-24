'use strict';

var Promise = require('bluebird');
var util = require('util');
var exec    = require('child_process').exec;
var config  = require('../../config/environment');

module.exports = function( ) {
  return new Promise(function(resolve, reject) {
    var dir = config.env === 'production' ? './' : './server/';

    var command = util.format(
      '/bin/bash ' + dir + 'run-ansible-local.sh %s %s',
      config.env,
      config.settingsFileStore
    );

    exec( command, function( exitCode, stdout, stderr ) {
      config.logger.debug(
        'ran "%s": exitCode: %s, stdout: %s, stderr: %s',
        command,
        exitCode,
        stdout,
        stderr
      );

      if( exitCode === null ) {
        return resolve({ stdout: stdout });
      } else {
        return reject( {stdout: stdout, stderr: stderr} );
      }
    });

  });
}
