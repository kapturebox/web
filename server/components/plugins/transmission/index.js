'use strict';

var Promise = require('bluebird');
var request = require('request');
var util    = require('util');
var _       = require('lodash');
var path    = require('path');


// CONFIG STUFF STILL HERE FOR THE URLS .. should be moved somewhere
var config  = require('../../../config/environment');


const RPC_URL = 'http://' + config.kaptureHost + ':' + config.transmissionPort + '/transmission/rpc';

const TRANSMISSION_USER  = config.transmissonUser;
const TRANSMISSION_PASS  = config.transmissionPass;
const ROOT_DOWNLOAD_PATH = config.rootDownloadPath;




var TransmissionDownloader = function( options ) {
  this.metadata = {
    pluginId: 'com.transmissionbt',          // Unique ID of plugin
    pluginName: 'Transmission',              // Display name of plugin
    pluginTypes: 'downloader',               // 'source', 'downloader', 'player'
    sourceTypes: 'adhoc',                    // 'adhoc', 'continuous'
    link: 'https://transmissionbt.com',      // Link to provider site
    downloadProviders: 'torrent',            // if plugin can also download, what
                                             // downloadMechanism can it download?
    description: 'Popular torrent downloader'// Description of plugin provider
  };

  TransmissionDownloader.super_.apply( this, arguments );

  this.mediaTypePathMap = {
    'movie'  : path.join( this.config.rootDownloadPath, this.config.moviesPath ),
    'video'  : path.join( this.config.rootDownloadPath, this.config.moviesPath ),
    'tvshow' : path.join( this.config.rootDownloadPath, this.config.showsPath ),
    'audio'  : path.join( this.config.rootDownloadPath, this.config.musicPath ),
    'music'  : path.join( this.config.rootDownloadPath, this.config.musicPath ),
    'photos' : path.join( this.config.rootDownloadPath, this.config.photosPath ),
    'other'  : path.join( this.config.rootDownloadPath, this.config.defaultMediaPath )
  }

  return this;
}



TransmissionDownloader.prototype.download = function( item ) {
  var self = this;
  return this.getSessionID().then(function( sessionid ) {
    return new Promise(function(resolve, reject) {
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
            'download-dir': self.getDownloadPath( item )
          }
        },
        headers: {
          'X-Transmission-Session-Id': sessionid,
        }
      }, function( err, resp, body ) {
        if( err || resp.statusCode !== 200 || body.result !== 'success' ) {
          reject( new Error(
            util.format( '[Transmission] code: %s, body: %s', resp.statusCode, body )
          ));
        } else {
          // TODO: Check to see if the hash from the response matches that
          // of the hash that came back from the source
          resolve( resp );
        }
      });
    })
  });
}

// takes the item as generated in search, and removes from list (with delete option if present)
TransmissionDownloader.prototype.remove = function( item, deleteOnDisk ) {
  var self = this;
  return this.getSessionID().then(function( sessionid ) {
    return new Promise(function( resolve, reject ) {
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
            'ids':               item.hashString,
            'delete-local-data': deleteOnDisk || false
          }
        },
        headers: {
          'X-Transmission-Session-Id': sessionid,
        }
      }, function( err, resp, body ) {
        if( err ) {
          reject( new Error(
            util.format( '[Transmission] code: %s, body: %s', resp.statusCode, body )
          ));
        } else {
          self.logger.info( 'successfully removed: ', item.title );
          resolve( body );
        }
      });
    })
  });
}

TransmissionDownloader.prototype.status = function( item ) {
  var self = this;
  return this.getSessionID().then(function( sessionid ) {
    return new Promise(function( resolve, reject ) {
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
          reject( new Error(
            util.format('cant parse output from transmission: (Resp code: %s): %s \n%s',  resp.statusCode, err, resp.body )
          ));
        } else {
          var ret = body.arguments.torrents.map(function(obj) {
            return _.extend( obj,  {
              mediaType: self.getMediaTypeFromPath( obj['downloadDir'] ),
              sourceId:  self.metadata.pluginId
            });
          });

          resolve( ret );
        }
      });
    });
  });
}


TransmissionDownloader.prototype.getDownloadPath = function ( item ) {
  return this.mediaTypePathMap[ item.mediaType ] || 'other';
}

TransmissionDownloader.prototype.getMediaTypeFromPath = function ( path ) {
  return _.invert( this.mediaTypePathMap )[ path ] || 'other';
}


TransmissionDownloader.prototype.getSessionID = function () {
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
        var err = util.format( '[Transmission] cant get session id' );
        if( resp ) {
          err = util.format( '[Transmission] cant parse output from transmission: (Resp code: %s): %s \n%s',  resp.statusCode, err, resp.body );
        }
        reject( new Error( err ));
      }
    });
  });
}



module.exports = TransmissionDownloader;
