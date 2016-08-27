'use strict';

var fs     = require('fs');
var path   = require('path');
var _      = require('lodash');
var config = require('./config/environment');



module.exports = function makeDirs() {
  var dirs = [
    path.join( config.rootDownloadPath, config.moviesPath ),
    path.join( config.rootDownloadPath, config.showsPath ),
    path.join( config.rootDownloadPath, config.musicPath ),
    path.join( config.rootDownloadPath, config.photosPath ),
    path.join( config.rootDownloadPath, config.defaultMediaPath )
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
