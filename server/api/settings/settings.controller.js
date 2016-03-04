'use strict';

var _ = require('lodash');
var YAML = require('yamljs');
var fs = require('fs');
var exec = require('child_process').exec;


var settingsFile = '/tmp/vars.yml';

// store settings for ansible
exports.postSettings = function(req, res) {
  var yaml_str = YAML.stringify( req.body, 2 );

  fs.writeFile( settingsFile, yaml_str, function( err ) {
    if( err ) {
      res.status(500).json({error: err});
      return;
    }

    var child = exec( './apply-system-settings.sh', function( exitCode, stdout, stderr ) {
      if( exitCode === null ) {
        res.status(200).send({ output: stdout });
      } else {
        console.error( "stderr: %s \n\nstdout: %s", stderr, stdout );
        res.status(500).json({ error: stderr });
      }
    });
  });
};

// get settings from ansible
exports.getSettings = function(req, res) {
  try {
    var json_obj = YAML.load( settingsFile );
    res.status(200).json( json_obj );
  } catch( err ) {
    res.status(500).json({ error: err });
  }
};
