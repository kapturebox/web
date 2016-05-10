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

// starts a new download
exports.addDownload = function( req, res ) {
  switch( req.body.item.source ) {
    case 'showrss':
      addShowrssSource( req.body, res );
      break;
    default:
      addTorrentSource( req.body, res );
      break;
  }
};

function addShowrssSource( reqbody, res ) {
  var newSeries = reqbody.item.title;
  var seriesObj;

  console.log( '[showrss] putting: ', newSeries );

  try {
    seriesObj = YAML.load( config.seriesFileStore );
  } catch ( err ) {
    seriesObj = fileSeriesTemplate();
  }

  seriesObj.series.push( newSeries );
  seriesObj.series = _.uniq( seriesObj.series );

  var yamlStr = YAML.stringify( seriesObj );
  fs.writeFile( config.seriesFileStore, yamlStr, function( err ) {
    if( err ) return res.status(500).json( err );
    return res.status(200).send();
  });
}

function fileSeriesTemplate() {
  return {
    series: []
  };
}



function addTorrentSource( reqbody, res ) {
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
          res.status(500).json({ error: err, resp: resp });
        } else {
          // TODO: Check to see if the hash from the response matches that
          // of the hash that came back from the source
          res.status(200).json( resp );
        }
      });
    })
    .catch(function( err ) {
      console.log( 'error getting session id: ', err );
    });
}






// Get list of downloads
exports.getDownloads = function( req, res ) {
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
            fields: ['name','totalSize','eta','rateDownload','isFinished','isStalled','percentDone','downloadDir']
          }
        },
        headers: {
          'X-Transmission-Session-Id': sessionid,
        }
      }, function( err, resp, body ) {
        if(err || resp.statusCode !== 200 || body.result !== 'success' ) {
          res.status(500).json({ error: err, resp: resp });
        } else {
          var ret = body.arguments.torrents.map(function(obj) {
            return _.extend( obj, {mediaType: getMediaTypeFromPath( obj['downloadDir'] )});
          });
          res.status(200).json( ret );
        }
      });
    })
    .catch(function(err) {
      console.log( 'error getting session id: ', err );
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
