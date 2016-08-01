'use strict';

var Promise = require('bluebird');
var request = require('request');
var util    = require('util');
var config  = require('../../../config/environment');

var KAT_JSON_URL = 'https://kat.cr/json.php';


var KickassSource = function( options ) {
  this.metadata = {
    pluginId: 'cr.kat',                  // Unique ID of plugin
    pluginName: 'Kickass',               // Display name of plugin
    pluginType: 'source',                // 'source', 'downloader', 'player'
    sourceType: 'adhoc',                 // 'adhoc', 'continuous'
    link: 'http://kat.cr',               // Link to provider site
    description: 'General torrent site'  // Description of plugin provider
  };

  return this;
}


KickassSource.prototype.url = function( url ) {

};

KickassSource.prototype.urlMatches = function( url ) {
  return false;
};

KickassSource.prototype.search = function( query ) {
  return new Promise( function( resolve, reject ) {
    request({
      url: KAT_JSON_URL,
      json: true,
      qs: {
        q: query,
        field: 'seeders',
        sort: 'desc'
      }
    },
    function( err, resp, body ) {
      if (!err && resp.statusCode == 200) {
        resp = transformKatResults( body.list );

        config.logger.info( 'Results from kat: ', resp.length );
        resolve( resp );
      } else {
        config.logger.warn( '[kat] cant get results: ', err );
        resolve( [] );
      }
    });
  });
};

KickassSource.prototype.download = function( url ) {
  return this.url( url );
};



module.exports = KickassSource;



// private functions


function transformKatResults( jsonResults ) {
  return jsonResults.map(function( d ) {
    return {
      source: 'Kickass',
      title: d.title,
      uploaded: d.pubDate,
      category: d.category,
      mediaType: determineKatMediaType( d ),
      size: d.size,
      downloadUrl: d.torrentLink,
      hashString: d.hash,
      peers: d.peers,
      score: d.votes
    }
  });
};

function determineKatMediaType( elem ) {
  switch( elem.category ) {
    case 'TV':
      return 'tvshow';
      break;
    case 'Movies':
    case 'Anime':
    case 'XXX':
      return 'video';
      break;
    case 'Music':
      return 'audio';
      break;
    default:
      return 'unknown';
      break;
  }
}
