'use strict';

var util = require('util');
var youtubedl = require('youtube-dl');


var YoutubeSource = function( options ) {
  this.metadata = {
    pluginId: 'com.youtube',                  // Unique ID of plugin
    pluginName: 'Youtube',                    // Display name of plugin
    pluginType: 'source',                     // 'source', 'downloader', 'player'
    sourceType: 'adhoc',                      // 'adhoc', 'continuous'
    link: 'https://youtube.com',              // Link to provider site
    description: 'You know what youtube is'   // Description of plugin provider
  };

  return this;
}


YoutubeSource.prototype.url = function( url ) {
  var video = youtubedl( url,
    // Optional arguments passed to youtube-dl.
    ['--format=18'],
    // Additional options can be given for calling `child_process.execFile()`.
    { cwd: __dirname }
  );

  // Will be called when the download starts.
  video.on( 'info', function( info ) {
    config.logger.info('[Youtube] Download started: %s, (%s)', info._filename, info.size);
    video.pipe(fs.createWriteStream(
      config.rootDownloadPath + config.defaultMediaPath + '/' + info._filename
    ));
  });

  video.on( 'end', function() {
    config.logger.info('Download complete!');
  });
};

YoutubeSource.prototype.urlMatches = function( url ) {
  return /^https?:\/\/(www\.|m\.)?youtube\.com\/.*/.test( url )
      || /^https?:\/\/youtu\.be\/.*/.test( url )
      || /^https?:\/\/(www\.)?vimeo\.com\//.test( url );
};

YoutubeSource.prototype.search = function( query ) {
  return {};
};

YoutubeSource.prototype.download = function( url ) {
  return this.url( url );
};

module.exports = YoutubeSource;
