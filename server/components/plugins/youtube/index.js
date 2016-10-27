'use strict';

var util          = require('util');
var youtubedl     = require('youtube-dl');
var youtubesearch = require('youtube-search');
var youtubesdk    = require('youtube-sdk');
var request       = require('request');
var crypto        = require('crypto');
var fs            = require('fs');
var _             = require('lodash');
var path          = require('path');
var sanitize      = require('sanitize-filename');
var Promse        = require('bluebird');


var youtubeSearchToken = 'AIzaSyAlhhTxfbaIjaCHi4qs5rl95PtpmcRTZTA';



function YoutubeSource( options ) {
  this.metadata = {
    pluginId: 'com.youtube',                  // Unique ID of plugin
    pluginName: 'Youtube',                    // Display name of plugin
    pluginTypes: ['source','downloader'],     // 'source', 'downloader', 'player'
    sourceTypes: 'adhoc',                     // 'adhoc', 'continuous'
    link: 'https://youtube.com',              // Link to provider site
    downloadProviders: 'youtube-dl',          // if plugin can also download, what
                                              // downloadMechanism can it download?
    description: 'You know what youtube is'   // Description of plugin provider
  };

  YoutubeSource.super_.apply( this, arguments );

  this.youtubesdk = new youtubesdk();
  this.youtubesdk.use( youtubeSearchToken );

  return this;
}


YoutubeSource.prototype.download = function( item ) {
  this.logger.info( '[Youtube] downloading: [%s] %s', item.id, item.title );
  return this.url( item.downloadUrl );
};


YoutubeSource.prototype.url = function( url ) {
  var self = this;

  return new Promise( function( resolve, reject ) {
    var kapResult = {};
    var lastTime = new Date();

    var video = youtubedl( url,
      ['--format=18'],
      { cwd: __dirname }
    );

    // Will be called when the download starts.
    video.on( 'info', function( retInfo ) {
      kapResult = self.transformDownloadResult( retInfo );

      self.logger.info( '[Youtube] download started: %s, (%s)', kapResult.filename, kapResult.size );

      try {
        video.pipe( fs.createWriteStream( kapResult.fullPath ));
      } catch( err ) {
        self.logger.error( '[Youtube] cant download %s: %s', kapResult.id, err.toString() );
      }

      resolve( kapResult );
    });

    // track position in file for use later
    video.on( 'data', function data( chunk ) {
      if( isNaN( kapResult.pos ) ) {
        kapResult.pos = 0;
      }

      var timeDelta = new Date() - lastTime;
      lastTime = new Date(); 

      kapResult.pos += chunk.length;

      if( kapResult.size ) {
        kapResult.percentDone  = kapResult.pos / kapResult.size;
        kapResult.rateDownload = chunk.length / timeDelta;
        kapResult.eta          = ( kapResult.size - kapResult.pos ) / kapResult.rateDownload;

        self.updateDownloadState( kapResult );
      }
    });

    // successful download
    video.on( 'end', function() {
      kapResult.isFinished = true;
      kapResult.isStalled = false;
      self.updateDownloadState( kapResult );
      self.logger.info( '[Youtube] download complete: [%s] %s', kapResult.id, kapResult.title );
    });

    // unsuccessful download
    video.on( 'error', function(err) {
      reject( new Error( err ) );
    });

  });
};

YoutubeSource.prototype.transformDownloadResult = function( result ) {
  var sha1 = crypto.createHash('sha1').update( result.id );

  return {
    sourceId:          this.metadata.pluginId,
    sourceName:        this.metadata.pluginName,
    downloadMechanism: this.metadata.downloadProviders,
    mediaType:         'video',
    hashString:        sha1.digest( 'hex' ),
    startDate:         new Date().toISOString(),
    title:             result.title,
    id:                result.id,
    size:              result.size,
    thumbnail:         result.thumbnails[0].url || null,
    filename:          result._filename,
    fullPath:          path.join( this.config.getUserSetting('rootDownloadPath'), this.config.getUserSetting('defaultMediaPath'), sanitize( result._filename ) )
   ,source_info:       result
  };

}

// as of 2016-09-13, it's psy's gangnam style :)
const MAX_YOUTUBE_VIEWS = 2642 * 1000000;  // 2.6 billion
const SCORE_SCALING_FACTOR = 5;

YoutubeSource.prototype.calculateScore = function( result ) {
  return ( result.statistics.viewCount / MAX_YOUTUBE_VIEWS ) * SCORE_SCALING_FACTOR;
}


YoutubeSource.prototype.updateDownloadState = function( result ) {
  return this.setState( result.id, result );
}



YoutubeSource.prototype.urlMatches = function( url ) {
  return /^https?:\/\/(www\.|m\.)?youtube\.com\/.*/.test( url )
      || /^https?:\/\/youtu\.be\/.*/.test( url )
      || /^https?:\/\/(www\.)?vimeo\.com\//.test( url );
};



YoutubeSource.prototype.search = function( query ) {
  var self = this;

  return new Promise(function( resolve, reject ) {
    var opts = {
      maxResults: 30,
      key: youtubeSearchToken,
      type: 'video',
      order: 'relevance'
    };

    youtubesearch( query, opts, function( err, results ) {
      if( err )  {
        return reject( new Error( err.toString() ) );
      }

      self.logger.info( '[%s] results: %d', self.metadata.pluginName, results.length );

      resolve( results );
    });
  }).then(function( ids ) {
    return self.getMetadataFromResults( ids );
  }).then(function( itemsWithMetadata ) {
    return self.transformSearchResults( itemsWithMetadata.items );
  });
};


YoutubeSource.prototype.getMetadataFromResults = function( results ) {
  var self = this;

  return new Promise(function( resolve, reject ) {
    var params = {
      part: 'snippet,statistics,contentDetails',
      id: results.map(function(e) {
        return e.id;
      }).join(',')
    };

    self.youtubesdk.get( 'videos', params, function( err, items ) {
      if( err ) {
        return reject( new Error( err.toString() ) );
      }
      resolve( items );
    })
  }); 

}

const YOUTUBE_VIDEO_URL = 'https://www.youtube.com/watch?v=%s';

YoutubeSource.prototype.transformSearchResults = function( results ) {
  var self = this;

  return results.map(function( e ) {
    var sha1 = crypto.createHash( 'sha1' ).update( e.id );

    return {
      sourceId:           self.metadata.pluginId,
      sourceName:         self.metadata.pluginName,
      downloadMechanism:  self.metadata.downloadProviders,
      mediaType:          'video',
      id:                 e.id,
      description:        e.snippet.description,
      title:              e.snippet.title,
      thumbnail:          e.snippet.thumbnails.default.url || null,
      uploaded:           e.snippet.publishedAt,
      downloadUrl:        util.format( YOUTUBE_VIDEO_URL, e.id ),
      hashString:         sha1.digest( 'hex' ),
      size:               self.calculateSize( e ),
      score:              self.calculateScore( e )
     ,source_data:        e
    }
  });
}

// this is wrong but it's a baseline at least.
const DURATION_REGEX = /PT((\d+)H)?((\d+)M)?((\d+)S)/;
const SD_BITS_PER_SEC = 1 * (1024) * 5;
const HD_BITS_PER_SEC = 8 * (1024) * 5;

YoutubeSource.prototype.calculateSize = function( result ) {
  var durMatches  = DURATION_REGEX.exec( result.contentDetails.duration );
  var dimension   = result.contentDetails.dimension;
  var definition  = result.contentDetails.definition;

  var seconds = ( parseInt(durMatches[2] || 0 ) * 60*60 ) + ( parseInt(durMatches[4] || 0 ) * 60 ) + ( parseInt(durMatches[6] || 0 ) );
  var ret     = seconds * ( definition === 'hd' ? HD_BITS_PER_SEC : SD_BITS_PER_SEC );

  // this.logger.debug( 'name: %s, seconds: %d, definition: %s, result: %d, matches: %s', result.snippet.title, seconds, definition, ret, durMatches );
  
  return ret;
}



YoutubeSource.prototype.status = function() {
  return this.getState() || [];
}



YoutubeSource.prototype.remove = function( item, deleteFromDisk ) {
  var self = this;

  return new Promise( function(resolve, reject) {
    try {
      var canonical = self.getState( item.id );
      if( canonical === undefined ) {
        throw new Error();
      }
    } catch( err ) {
      return reject( new Error( 'cant find item to delete in store' ));
    }

    try {
      if( deleteFromDisk )  {
        fs.unlinkSync( canonical.fullPath );
      }

      resolve( self.removeState( canonical.id ) );
    } catch(err) {
      return reject( new Error( err.toString() ));
    }
  })
}

module.exports = YoutubeSource;
