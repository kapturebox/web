'use strict';

var _       = require('lodash');
var YAML    = require('yamljs');
var fs      = require('fs');
var exec    = require('child_process').exec;
var config  = require('../../config/environment');
var util    = require('util');


var settingsFile = config.settingsFileStore;


// store settings for ansible
exports.postSettings = function( req, res, next ) {
  var yaml_str = YAML.stringify( req.body, 2 );

  fs.writeFile( settingsFile, yaml_str, function( err ) {
    if( err ) {
      return next(new Error( err ));
    }

    var command = util.format( 'flock /tmp/ansiblerunlock ./server/run-ansible-local.sh %s %s', config.env, config.settingsFileStore );

    exec( command, function( exitCode, stdout, stderr ) {
      config.logger.debug( 'ran "%s": exitCode: %s, stdout: %s, stderr: %s', command, exitCode, stdout, stderr );
      if( exitCode === null ) {
        res.status(200).send({ output: stdout });
      } else {
        return next(new Error( err ));
      }
    });
  });
};

function defaultSystemFile() {
  return {
    systemname: 'kapture',
    flexget_check_frequency: 15,
    email: null
  };
}

// get settings from ansible
exports.getSettings = function( req, res, next ) {
  try {
    var json_obj = YAML.load( settingsFile );
    res.status(200).json( json_obj );
  } catch( err ) {
    res.status(200).json( defaultSystemFile() );
  }
};
