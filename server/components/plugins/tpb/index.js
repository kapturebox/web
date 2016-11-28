'use strict';

var Promise = require('bluebird');
var request = require('request');
var util    = require('util');
var tpb     = require('thepiratebay');

var Plugin = require('../../plugin_handler/plugin_base');

// do some funky date stuff .. extends Date
require('datejs');



var SIZE_MULTIPLIERS = {};

SIZE_MULTIPLIERS.B = 1;
SIZE_MULTIPLIERS.KiB = ( SIZE_MULTIPLIERS.B   * 1024 );
SIZE_MULTIPLIERS.MiB = ( SIZE_MULTIPLIERS.KiB * 1024 );
SIZE_MULTIPLIERS.GiB = ( SIZE_MULTIPLIERS.MiB * 1024 );
SIZE_MULTIPLIERS.TiB = ( SIZE_MULTIPLIERS.GiB * 1024 );
SIZE_MULTIPLIERS.PiB = ( SIZE_MULTIPLIERS.TiB * 1024 );
SIZE_MULTIPLIERS.EiB = ( SIZE_MULTIPLIERS.PiB * 1024 );
SIZE_MULTIPLIERS.ZiB = ( SIZE_MULTIPLIERS.EiB * 1024 );




var ThepiratebaySource = function( options ) {
  this.metadata = {
    pluginId: 'com.piratebay',               // Unique ID of plugin
    pluginName: 'ThePirateBay',              // Display name of plugin
    pluginTypes: 'source',                    // 'source', 'downloader', 'player'
    sourceType: 'adhoc',                     // 'adhoc', 'continuous'
    link: 'http://thepiratebay.se',          // Link to provider site
    description: 'General torrent site'      // Description of plugin provider
  };
  
  ThepiratebaySource.super_.apply( this, arguments );

  return this;
}

ThepiratebaySource.prototype.url = function( url ) {
  return false;
};

ThepiratebaySource.prototype.urlMatches = function( url ) {
  return false;
};

ThepiratebaySource.prototype.search = function( query ) {
  var self = this;
  return tpb.search( query, {
      orderBy: 'seeds'
    })
    .then(function( results ) {
      self.logger.info( '[tpb] results: ', results.length );
      return self.transformResults( results );
    })
    .catch( function(err) {
      self.logger.warn( '[tpb] cant get results:', err );
      return [];
    });
};

ThepiratebaySource.prototype.download = function( url ) {
  return this.url( url );
};


ThepiratebaySource.prototype.getDownloadStatus = function() {
  return [];
}


ThepiratebaySource.prototype.removeWeirdCharacters = function( str ) {
  return str.replace( '\xc2','' )
            .replace( '\xa0','\x20' );
}



ThepiratebaySource.prototype.transformResults = function( jsonResults ) {
  var self = this;
  return jsonResults.map(function( d ) {
    // uploadDate field and size field needs some transforming
    // uploadDate has some weird special tpb format
    var date;

    try {
      var dateString = self.removeWeirdCharacters( d.uploadDate )
          .replace( /([0-9]{2}-[0-9]{2})\s([0-9]{4})?/, function( match, g1, g2 ) {
            return g1 + '-' + (g2 ? g2 + ' 00:00' : new Date().toString('yyyy')) + ' ';
          })
          .toLowerCase()
          + '-00:00';


      date = Date.parse( dateString );

      if( date == null ) {
        self.logger.warn( '[tpb] failed to parse entry date: ', dateString );
      }
    } catch( err ) {
      self.logger.warn( '[tpb] failed to parse entry date: ', d.uploadDate );
    }

    return {
      sourceId:           self.metadata.pluginId,
      sourceName:         self.metadata.pluginName,
      tpbUploadDate:      d.uploadDate,
      tpbId:              d.id,
      tpbCategory:        d.category.name + ':' + d.subcategory.name,
      title:              d.name,
      uploaded:           date,
      category:           d.subcategory.name,
      mediaType:          self.determineMediaType( d ),
      size:               self.convertSize( d.size ),
      downloadUrl:        d.magnetLink,
      magnetLink:         d.magnetLink,
      hashString:         d.magnetLink.match( /urn:btih:([a-z0-9]{40})/ )[1],
      peers:              parseInt( d.seeders ) + parseInt( d.leechers ),
      seeders:            parseInt( d.seeders ),
      leechers:           parseInt( d.leechers ),
      score:              self.calculateScore( d ),
      source_data:        d,
      downloadMechanism:  'torrent'
    }
  });
};



ThepiratebaySource.prototype.determineMediaType = function ( elem ) {
  switch( elem.category.name + ':' + elem.subcategory.name ) {
    case 'Video:HD - TV shows':
    case 'Video:TV shows':
      return 'tvshow';
    case 'Video:Movies':
    case 'Video:HD - Movies':
    case 'Video:undefined':
    case 'Video:':
    case 'Video:Anime':
    case 'Video:XXX':
    case 'Porn:Movie clips':
    case 'Porn:':
    case 'Porn:Movies':
    case 'Porn:HD - Movies':
      return 'video';
    case 'Audio':
    case 'Audio:Music':
    case 'Audio:Other':
      return 'music';
    default:
      return 'unknown';
  }
}

const MAX_ACTIVE_SEEDERS = 10000;

ThepiratebaySource.prototype.calculateScore = function ( result ) {
  return result.seeders / MAX_ACTIVE_SEEDERS;
}


ThepiratebaySource.prototype.convertSize = function ( sizeString ) {
  var split = this.removeWeirdCharacters( sizeString ).split( ' ' );
  return parseFloat( split[0] ) * SIZE_MULTIPLIERS[ split[1] ];
}




module.exports = ThepiratebaySource;
