'use strict';

var util = require('util');


var ShowRssSource = function( options ) {
  this.metadata = {
    pluginId: 'info.showrss',                 // Unique ID of plugin
    pluginName: 'ShowRss',                    // Display name of plugin
    pluginType: 'source',                     // 'source', 'downloader', 'player'
    sourceType: 'continuous',                 // 'adhoc', 'continuous'
    link: 'http://showrss.info/',             // Link to provider site
    description: 'Updated feed of TV shows'   // Description of plugin provider
  };

  return this;
}


// ShowRssSource.prototype.url = function( url ) {
// };

// ShowRssSource.prototype.urlMatches = function( url ) {
//   return false;
// };

ShowRssSource.prototype.search = function( query ) {
  return {};
};

ShowRssSource.prototype.addItem = function( item ) {

}

ShowRssSource.prototype.download = function( url ) {
  return this.url( url );
};

module.exports = ShowRssSource;
