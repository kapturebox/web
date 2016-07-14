'use strict';

var _ = require('lodash');
var Promise = require('bluebird');
var ngrok = require('ngrok');
var config = require('../../config/environment');
var spawn = require('child_process').spawn;

var destHost = 'localhost';
var destPort = 22;


// run ngrok if enabled .. outputs url to connect to to client
// only 4 tunnels can run at a time with the basic subscription
exports.index = function( req, res ) {
  if( ! config.ngrokEnabled ) {
    return res.status(501).json({ error: 'remote not enabled' });
  }

  setAuthToken( ngrok )
    .then(function( ng ) {
      ng.connect({
        proto: 'tcp',
        addr: destHost + ':' + destPort
      }, function( err, url ) {
        if( err ) {
          return res.status(500).json({ error: err });
        }

        var endNgrok = function() {
          ng.disconnect();
          ng.kill();
          config.logger.info( '[ngrok] cleanup success' );
        }

        // kill ngrok after timeout time
        setTimeout( endNgrok, config.ngrokTimeout );

        // ensure ngrok is torn down when process dies
        process.on( 'exit', endNgrok );

        res.status(200).json({
          dest: destHost + ':' + destPort,
          remoteUrl: url,
          timeoutMs: config.ngrokTimeout
        });
      });
    })
    .catch(function( err ) {
      config.logger.error( err );
      res.status(500).json({ error: err });
    });
};

// set auth token for ngrok package, return promise
// shitty setup, but this is only temp and for Debugging
// should really fix the ngrok node module to properly handle errors
// instead of just looking at if there's stderr
// also should detect if the bin is accurate
function setAuthToken( ng ) {
  return new Promise(function(resolve,reject) {
    var cmd = spawn(
      './ngrok',
      ['authtoken',config.ngrokAuthToken],
      {cwd: __dirname + '/../../node_modules/ngrok/bin'}
    );

    cmd.on( 'stderr', config.logger.error.bind );
    cmd.on( 'stdout', config.logger.info.bind );
    cmd.on( 'close', function( code ) {
      if( code != 0 ) {
        return reject( code );
      }
      resolve( ng );
    });
  });
}
