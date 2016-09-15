'use strict';

var fs     = require('fs');
var path   = require('path');
var _      = require('lodash');



module.exports = function makeDirs( config ) {
  var dirs = [
    path.join( config.getUserSetting('rootDownloadPath'), config.getUserSetting('moviesPath') ),
    path.join( config.getUserSetting('rootDownloadPath'), config.getUserSetting('showsPath') ),
    path.join( config.getUserSetting('rootDownloadPath'), config.getUserSetting('musicPath') ),
    path.join( config.getUserSetting('rootDownloadPath'), config.getUserSetting('photosPath') ),
    path.join( config.getUserSetting('rootDownloadPath'), config.getUserSetting('defaultMediaPath') )
  ];

  dirs.forEach(function(dir) {
    var parents = [];
    var parent = path.dirname( dir );

    while( parent !== '/' ) {
      if( ! _.includes( dirs, parent) ) {
        dirs.unshift( parent );
      }

      parent = path.dirname( parent );
    }
  });

  dirs.forEach(function( dir ) {
    if( !fs.existsSync( dir )) {
      config.logger.debug( 'making dir %s', dir );
      fs.mkdirSync( dir );
    }
  });
}
