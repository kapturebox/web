'use strict';

var util          = require('util');
var youtubedl     = require('youtube-dl');
var youtubesearch = require('youtube-search');
var request       = require('request');
var crypto        = require('crypto');
var fs            = require('fs');
var _             = require('lodash');
var path          = require('path');
var sanitize      = require('sanitize-filename');


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

  return this;
}


YoutubeSource.prototype.download = function( item ) {
  this.logger.info( '[Youtube] downloading: [%s] %s', item.youtubeId, item.title );
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

      self.logger.info( '[Youtube] download started: %s, (%s)', kapResult.filename, kapResult.totalSize );

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

      kapResult.percentDone  = kapResult.pos / kapResult.totalSize;
      kapResult.rateDownload = chunk.length / timeDelta;
      kapResult.eta          = ( kapResult.totalSize - kapResult.pos ) / kapResult.rateDownload;

      // && new Date().getTime() % 100 === 0

      if( kapResult.totalSize ) {
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
    name:              result.title,
    title:             result.title,
    id:                result.id,
    totalSize:         result.size,
    thumbnail:         result.thumbnails[0].url || null,
    filename:          result._filename,
    fullPath:          path.join( this.config.rootDownloadPath, this.config.defaultMediaPath, sanitize( result._filename ) ),
    score:             this.calculateScore( result )
    // ,source_info: result
  };

}

YoutubeSource.prototype.calculateScore = function( result ) {
  return ( result.like_count - result.dislike_count ) / result.view_count * 100;
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
      maxResults: 10,
      key: youtubeSearchToken,
      type: 'video'
    };

    youtubesearch( query, opts, function( err, results ) {
      if( err )  {
        return reject( new Error( err.toString() ) );
      }

      self.logger.info( '[%s] results: %d', self.metadata.pluginName, results.length );

      resolve( self.transformSearchResults( results ) );
    });
  });
};


YoutubeSource.prototype.transformSearchResults = function( results ) {
  var self = this;

  return results.map(function( e ) {
    var sha1 = crypto.createHash('sha1').update( e.id );

    return {
      sourceId:           self.metadata.pluginId,
      sourceName:         self.metadata.pluginName,
      downloadMechanism:  self.metadata.downloadProviders,
      mediaType:          'video',
      id:                 e.id,
      youtubeId:          e.id,
      youtubeKind:        e.kind,
      youtubeDescription: e.description,
      title:              e.title,
      thumbnail:          e.thumbnails.default.url || null,
      uploaded:           e.publishedAt,
      downloadUrl:        e.link,
      hashString:         sha1.digest( 'hex' )
    }
  });
}


YoutubeSource.prototype.status = function() {
  return this.getState() || [];
}



YoutubeSource.prototype.remove = function( item, deleteOnDisk ) {
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
      if( deleteOnDisk )  {
        fs.unlinkSync( canonical.fullPath );
      }

      resolve( self.removeState( canonical.id ) );
    } catch(err) {
      return reject( new Error( err.toString() ));
    }
  })
}

module.exports = YoutubeSource;
