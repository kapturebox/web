'use strict';

var util = require('util');
var youtubedl = require('youtube-dl');
var youtubesearch = require('youtube-search');
var request = require('request');
var crypto = require('crypto');

var config  = require('../../../config/environment');


var youtubeSearchToken = 'AIzaSyAlhhTxfbaIjaCHi4qs5rl95PtpmcRTZTA';




var YoutubeSource = function( options ) {
  YoutubeSource.super_.call(this);

  this.metadata = {
    pluginId: 'com.youtube',                  // Unique ID of plugin
    pluginName: 'Youtube',                    // Display name of plugin
    pluginType: 'source',                     // 'source', 'downloader', 'player'
    sourceType: 'adhoc',                      // 'adhoc', 'continuous'
    link: 'https://youtube.com',              // Link to provider site
    description: 'You know what youtube is'   // Description of plugin provider
  };
}




YoutubeSource.prototype.url = function( url ) {
  return new Promise( function( resolve, reject ) {
    config.logger.info( '[Youtube] downloading %s', url );
    var video = youtubedl( url,
      // Optional arguments passed to youtube-dl.
      ['--format=18'],
      // Additional options can be given for calling `child_process.execFile()`.
      { cwd: __dirname }
    );

    // Will be called when the download starts.
    video.on( 'info', function( info ) {
      config.logger.info( '[Youtube] Download started: %s, (%s)', info._filename, info.size );
      video.pipe( fs.createWriteStream(
        config.rootDownloadPath + config.defaultMediaPath + '/' + info._filename
      ));
    });

    video.on( 'end', function() {
      config.logger.info( 'Download complete!' );
      resolve();
    });

    video.on( 'error', reject );
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

YoutubeSource.prototype.getDownloadStatus = function() {
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




YoutubeSource.prototype.download = function( url ) {
  config.logger.debug( 'in download' );
  return this.url( url );
};

module.exports = YoutubeSource;
