'use strict';

var _       = require('lodash');
var request = require('request');
var Promise = require('bluebird');
var YAML    = require('yamljs');
var fs      = require('fs');

var config = require('../../config/environment');


var RPC_URL = 'http://' + config.kaptureHost + ':' + config.transmissionPort + '/transmission/rpc';

var TRANSMISSION_USER  = config.transmissonUser;
var TRANSMISSION_PASS  = config.transmissionPass;
var ROOT_DOWNLOAD_PATH = config.rootDownloadPath;

// removes a given hashString
exports.removeDownload = function( req, res, next ) {
  var hash = req.params.hashString;
  var perm = req.body.delete ? true : false;

  getSessionID()
    .then(function( sessionid ) {
      request({
        url: RPC_URL,
        method: 'POST',
        auth: {
          user: TRANSMISSION_USER,
          pass: TRANSMISSION_PASS
        },
        json: {
          method: 'torrent-remove',
          arguments: {
            'ids': hash,
            'delete-local-data': perm
          }
        },
        headers: {
          'X-Transmission-Session-Id': sessionid,
        }
      }, function( err, resp, body ) {
        if( err ) {
          return next(new Error( err ));
        }

        config.logger.info( 'successfully removed: ', hash );
        return res.status(200).json( body );
      });
    }).catch(function( err ) {
      return next(new Error( {error: err, msg: 'cant get session id'} ));
    });

}


// starts a new download
exports.addDownload = function( req, res, next ) {
  addTorrentSource( req.body, res, next );
};


function addTorrentSource( reqbody, res, next ) {
  getSessionID()
    .then(function( sessionid ) {
      request({
        url: RPC_URL,
        method: 'POST',
        auth: {
          user: TRANSMISSION_USER,
          pass: TRANSMISSION_PASS
        },
        json: {
          method: 'torrent-add',
          arguments: {
            'filename':     reqbody.item.downloadUrl,
            'download-dir': getDownloadPath( reqbody.item )
          }
        },
        headers: {
          'X-Transmission-Session-Id': sessionid,
        }
      }, function( err, resp, body ) {
        if(err || resp.statusCode !== 200 || body.result !== 'success' ) {
          return next(new Error( {error: err, resp: resp, body: body} ));
        } else {
          // TODO: Check to see if the hash from the response matches that
          // of the hash that came back from the source
          return res.status(200).json( resp );
        }
      });
    })
    .catch(function( err ) {
      return next(new Error( err ));
    });
}






// Get list of downloads
exports.getDownloads = function( req, res, next ) {
  getSessionID()
    .then(function( sessionid ) {
      request({
        url: RPC_URL,
        method: 'POST',
        auth: {
          user: TRANSMISSION_USER,
          pass: TRANSMISSION_PASS
        },
        json: {
          method: 'torrent-get',
          arguments: {
            fields: [
              'name',
              'totalSize',
              'eta',
              'rateDownload',
              'isFinished',
              'isStalled',
              'percentDone',
              'downloadDir',
              'hashString',
              'startDate'
            ]
          }
        },
        headers: {
          'X-Transmission-Session-Id': sessionid,
        }
      }, function( err, resp, body ) {
        if(err || resp.statusCode !== 200 || body.result !== 'success' ) {
          return next(new Error( err ));
        } else {
          var ret = body.arguments.torrents.map(function(obj) {
            return _.extend( obj, {mediaType: getMediaTypeFromPath( obj['downloadDir'] )});
          });
          res.status(200).json( ret );
        }
      });
    })
    .catch(function(err) {
      config.logger.error( 'error getting session id: ', err );
    });
}


var mediaTypePathMap = {
  'movie'  : config.rootDownloadPath + config.moviesPath,
  'video'  : config.rootDownloadPath + config.moviesPath,
  'tvshow' : config.rootDownloadPath + config.showsPath,
  'audio'  : config.rootDownloadPath + config.musicPath,
  'music'  : config.rootDownloadPath + config.musicPath,
  'photos' : config.rootDownloadPath + config.photosPath,
  'other'  : config.rootDownloadPath + config.defaultMediaPath
}


function getDownloadPath( item ) {
  return mediaTypePathMap[item.mediaType];
}

function getMediaTypeFromPath( path ) {
  return _.invert(mediaTypePathMap)[path];
}


function getSessionID() {
  return new Promise( function( resolve, reject ) {
    request({
      url: RPC_URL,
      method: 'POST',
      auth: {
        user: TRANSMISSION_USER,
        pass: TRANSMISSION_PASS
      }
    }, function( err, resp, body ) {
      if( !err && resp.statusCode != 200 ) {
        resolve( resp.headers['x-transmission-session-id'] );
      } else {
        reject( new Error( err ) );
      }
    });
  });
}
