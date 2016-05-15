'use strict';

var _ = require('lodash');
var YAML = require('yamljs');
var fs = require('fs');
var exec = require('child_process').exec;
var config = require('../../config/environment');


var settingsFile = config.settingsFileStore;


// store settings for ansible
exports.postSettings = function( req, res, next ) {
  var yaml_str = YAML.stringify( req.body, 2 );

  fs.writeFile( settingsFile, yaml_str, function( err ) {
    if( err ) {
      return next(new Error( err ));
    }

    if( process.env.NODE_ENV == 'production' ) {
      var child = exec( './server/apply-system-settings.sh', function( exitCode, stdout, stderr ) {
        if( exitCode === null ) {
          res.status(200).send({ output: stdout });
        } else {
          console.error( "stderr: %s \n\nstdout: %s", stderr, stdout );
          return next(new Error( err ));
        }
      });
    } else {
      res.status(200).send();
    }
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
