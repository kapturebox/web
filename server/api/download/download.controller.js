'use strict';

var _       = require('lodash');
var request = require('request');
var Promise = require('bluebird');
var YAML    = require('yamljs');
var fs      = require('fs');

var plugins = require('../../components/plugin_handler');
var config = require('../../config/environment');


var RPC_URL = 'http://' + config.kaptureHost + ':' + config.transmissionPort + '/transmission/rpc';

var TRANSMISSION_USER  = config.transmissonUser;
var TRANSMISSION_PASS  = config.transmissionPass;
var ROOT_DOWNLOAD_PATH = config.rootDownloadPath;



/////////////////////////////////////////
// Start of at backend download service
// To be refactored later
/////////////////////////////////////////

var MockDownloadService = {
  // remove a specific item from our list of downloads
  remove: function( item, deleteOnDisk ) {
    config.logger.debug( '[DownloadService] removing: %s', item.title );

    switch( item.downloadMechanism ) {
      case 'torrent':
          return removeTorrentDownload( item );
        break;
      case 'youtube-dl':
          return removePluginDownload( item );
        break;
      default:
        throw new Error( 'unknown download method: ' + item.downloadMechanism );
    }
  },

  // add a specific item to whatever download queue it needds to be downloaded with
  add: function( item ) {
    config.logger.debug( '[DownloadService] adding: %s', item.title );

    switch( item.downloadMechanism ) {
      case 'torrent':
          return addTorrentDownload( item );
        break;
      case 'youtube-dl':
          config.logger.debug( 'in youtube-dl' );
          return addPluginDownload( item );
        break;
      default:
        throw new Error( 'unknown download method: ' + item.downloadMechanism );
    }
  },

  // get status of all downloads in system
  status: function() {
    config.logger.debug( '[DownloadService] getting downloads..' );

    return Promise.all([
      getTorrentDownloads(),
      getPluginDownloadStatus()
    ])
    .then( function( statuses ) {
      return statuses.reduce( function( last, cur ) {
        return _.concat( last, _.reject( cur, _.isEmpty ) );
      }, []);
    });
  }
}


function addPluginDownload( item ) {
  // return
  var p =
    plugins
      .getPlugin( item.sourceId )
  config.logger.debug( 'addPlugin: ', p );
      p.download( item );
}

function removePluginDownload( item ) {
  return
    plugins
      .getPlugin( item.sourceId )
      .remove( item );
}

function getPluginDownloadStatus() {
  return
    plugins
      .getAllPlugins()
      .map(function( p ) {
        return p.getDownloadStatus();
      })
      .reduce(function( last, cur ) {
        return _.concat( last, cur );
      }, []);
}



/////////////////////////////////////////
// Start of Express entry points
/////////////////////////////////////////

// remove download from system, with switch to delete from FS if desired
exports.removeDownload = function( req, res, next ) {
  MockDownloadService
    .remove( req.body.item, req.body.deleteFileOnDisk )
    .then(function( resp ) {
      res.status(200).json( resp );
      return resp;
    })
    .catch( function( err ) {
      res.status(500).json({ error: err });
      return next(new Error( err ));
    })
}


// starts a new download of given item, expecting a specific 'downloadMechanism'
exports.addDownload = function( req, res, next ) {
  var p =
  MockDownloadService
    .add( req.body.item );
    config.logger.debug( 'addDl:', p );
    p.then( function( resp ) {
      res.status(200).json( resp );
      return resp;
    })
    .catch( function( err ) {
      res.status(500).json({ error: err });
      return next(new Error( err ));
    });
};

// get status of all downloads tracked
exports.getDownloads = function( req, res, next ) {
  MockDownloadService
    .status()
    .then( function( results ) {
      res.status(200).json( results );
      return results;
    })
    .catch( function( err ) {
      res.status(500).json({ error: err });
      return next(new Error( err ));
    });
}






/////////////////////////////////////////
// Start of Torrent specific portion
/////////////////////////////////////////

// removes a given hashString
function removeTorrentDownload( hash, permanent ) {
  var perm = permanent ? true : false;

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
          return new Promise.reject( err ));
        }

        config.logger.info( 'successfully removed: ', hash );
        return res.status(200).json( body );
      });
    }).catch(function( err ) {
      return next(new Error( {error: err, msg: 'cant get session id'} ));
    });

}



function addTorrentDownload( item ) {
  return
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
            'filename':     item.downloadUrl,
            'download-dir': getDownloadPath( item )
          }
        },
        headers: {
          'X-Transmission-Session-Id': sessionid,
        }
      }, function( err, resp, body ) {
        if( err || resp.statusCode !== 200 || body.result !== 'success' ) {
          throw new Error( {error: err, resp: resp, body: body} );
        } else {
          // TODO: Check to see if the hash from the response matches that
          // of the hash that came back from the source
          return resp;
        }
      });
    });
}


// Get list of downloads
function getTorrentDownloads() {
  return
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
          config.logger.error('cant parse output from transmission: (Resp code: %s): %s \n%s',  resp.statusCode, err, resp.body );
          return Promise.reject( err );
        } else {

          var ret = body.arguments.torrents.map(function(obj) {
            return _.extend( obj, {mediaType: getMediaTypeFromPath( obj['downloadDir'] )});
          });

          return ret;
        }
      });
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
