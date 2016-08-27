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
    pluginTypes: 'source',                // 'source', 'downloader', 'player'
    sourceType: 'adhoc',                 // 'adhoc', 'continuous'
    link: 'http://kat.cr',               // Link to provider site
    description: 'General torrent site'  // Description of plugin provider
  };
  
  KickassSource.super_.apply( this, arguments );

  return this;
}


KickassSource.prototype.url = function( url ) {

};

KickassSource.prototype.urlMatches = function( url ) {
  return false;
};

KickassSource.prototype.search = function( query ) {
  var self = this;
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

        self.logger.info( 'Results from kat: ', resp.length );
        resolve( resp );
      } else {
        self.logger.warn( '[kat] cant get results: ', err );
        resolve( [] );
      }
    });
  });
};

KickassSource.prototype.download = function( url ) {
  return this.url( url );
};

KickassSource.prototype.getDownloadStatus = function() {
  return [];
}



KickassSource.prototype.transformKatResults = function ( jsonResults ) {
  var self = this;
  return jsonResults.map(function( d ) {
    return {
      sourceId:    self.metadata.pluginId,
      sourceName:  self.metadata.pluginName,      
      title:       d.title,
      uploaded:    d.pubDate,
      category:    d.category,
      mediaType:   self.determineKatMediaType( d ),
      size:        d.size,
      downloadUrl: d.torrentLink,
      hashString:  d.hash,
      peers:       d.peers,
      score:       d.votes
    }
  });
};

KickassSource.prototype.determineKatMediaType = function ( elem ) {
  switch( elem.category ) {
    case 'TV':
      return 'tvshow';
    case 'Movies':
    case 'Anime':
    case 'XXX':
      return 'video';
    case 'Music':
      return 'audio';
    default:
      return 'unknown';
  }
}

module.exports = KickassSource;
