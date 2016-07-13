'use strict';

var _ = require('lodash');
var Promise = require('bluebird');
var ngrok = require('ngrok');
var config = require('../../config/environment');


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
        addr: 22
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
function setAuthToken( ng ) {
  return new Promise(function(resolve,reject) {
    ng.authtoken( config.ngrokAuthToken, function( err, token ) {
      if( err ) {
        return reject( err );
      }

      return resolve( ng );
    });
  })
}
