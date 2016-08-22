'use strict';

var util = require('util');
var youtubedl = require('youtube-dl');
var youtubesearch = require('youtube-search');
var request = require('request');
var crypto = require('crypto');
var fs = require('fs');
var sanitize = require('sanitize-filename');

var config  = require('../../../config/environment');


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

  return this;
}


YoutubeSource.prototype.download = function( item ) {
  config.logger.info( '[Youtube] downloading: [%s] %s', item.youtubeId, item.title );
  return this.url( item.downloadUrl );
};


YoutubeSource.prototype.url = function( url ) {
  return new Promise( function( resolve, reject ) {
    var info = {
      size: null,
      pos: 0
    };

    // get some metadata for use later
    youtubedl.getInfo( url, function( err, retInfo ) {
      if( !err ) {
        info.title = retInfo.title;
        info.id    = retInfo.id;
        info.size  = retInfo.size;
      }
    });

    var video = youtubedl( url,
      ['--format=18'],
      { cwd: __dirname }
    );

    // Will be called when the download starts.
    video.on( 'info', function( retInfo ) {
      config.logger.info( '[Youtube] Download started: %s, (%s)', retInfo._filename, retInfo.size );

      video.pipe( fs.createWriteStream(
        config.rootDownloadPath + config.defaultMediaPath + '/' + sanitize( retInfo._filename )
      ));

      resolve( retInfo );
    });

    // track position in file for use later
    video.on( 'data', function data( chunk ) {
      info.pos += chunk.length;

      // `size` should not be 0 here.
      if( info.size ) {
        var percent = (info.pos / info.size * 100).toFixed( 2 );
        config.logger.info( percent + '%' );
      }
    });

    // successful download
    video.on( 'end', function() {
      config.logger.info( '[Youtube] Download complete: [%s] %s', info.id, info.title );
    });

    // unsuccessful download
    video.on( 'error', function(err) {
      reject(new Error( err ));
    });

  });
};




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
        return reject( err );
      }

      config.logger.info( '[%s] results: %d', self.metadata.pluginName, results.length );

      resolve( self.transformResults( results ) );
    });
  });
};

YoutubeSource.prototype.status = function() {
  return [];
}




YoutubeSource.prototype.transformResults = function( results ) {
  var self = this;

  return results.map(function( e ) {
    var sha1 = crypto.createHash('sha1').update( e.id );

    return {
      sourceId: self.metadata.pluginId,
      source: self.metadata.pluginName,
      youtubeId: e.id,
      youtubeKind: e.kind,
      youtubeDescription: e.description,
      title: e.title,
      icon: e.thumbnails.default.url || null,
      uploaded: e.publishedAt,
      mediaType: 'video',
      downloadUrl: e.link,
      hashString: sha1.digest( 'hex' ),
      downloadMechanism: 'youtube-dl'
    }
  });
}





module.exports = YoutubeSource;
