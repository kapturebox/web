'use strict';

var youtubedl = require('youtube-dl');

module.exports = function( config ) {
  metadata: {
    pluginId: 'com.youtube',
    pluginName: 'Youtube',
    link: 'https://youtube.com',
    description: 'You know what this is'
  },

  isEnabled: function() {
    return
  },

  enable: function()


  url: function( url ) {
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
  },

  urlMatches: function( url ) {
    return /^https?:\/\/(www\.|m\.)?youtube\.com\/.*/.test( url )
        || /^https?:\/\/youtu\.be\/.*/.test( url )
        || /^https?:\/\/(www\.)?vimeo\.com\//.test( url );
  },

  search: function( query ) {
    return {};
  },

  download: function( url ) {
    return url( url );
  }
}
