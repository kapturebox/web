'use strict';

var _               = require('lodash');
var YAML            = require('yamljs');
var fs              = require('fs');
var os              = require('os');
var exec            = require('child_process').exec;
var config          = require('../../config/environment');
var util            = require('util');
var run_ansible     = require('../../components/run_ansible');


var settingsFile = config.settingsFileStore;


// store settings for ansible
exports.postSettings = function( req, res, next ) {
  var yaml_str = YAML.stringify( req.body, 2 );

  fs.writeFile( settingsFile, yaml_str, function( err ) {
    if( err ) {
      return next(new Error( err ));
    }

    run_ansible().then(function( stdout ) {
      return res.status(200).send( stdout );
    }).catch(function( err ) {
      return next(new Error( err ));
    });
  });
};

function defaultSystemFile() {
  return {
    systemname: os.hostname(),
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
