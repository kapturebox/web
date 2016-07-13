'use strict';

var util = require('util');


var KickassSource = function( options ) {
  this.metadata = {
    pluginId: 'cr.kat',                  // Unique ID of plugin
    pluginName: 'Kickass',               // Display name of plugin
    pluginType: 'source',                // 'source', 'downloader', 'player'
    sourceType: 'adhoc',                 // 'adhoc', 'continuous'
    link: 'http://kat.cr',               // Link to provider site
    description: 'General torrent site'  // Description of plugin provider
  };

  return this;
}


KickassSource.prototype.url = function( url ) {
  
};

KickassSource.prototype.urlMatches = function( url ) {
  return false;
};

KickassSource.prototype.search = function( query ) {
  return {};
};

KickassSource.prototype.download = function( url ) {
  return this.url( url );
};

module.exports = KickassSource;
