'use strict';

var Promise = require('bluebird');
var request = require('request');
var _       = require('lodash');
var config  = require('../../../config/environment');

var xpath = require('xpath');
var dom   = require('xmldom').DOMParser;

var xml2js = require('xml2json-light');


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
  var SHOWS_URL   = 'http://showrss.info/browse';
  var SHOWS_XPATH = '//*[@id="showselector"]/option';

  if( _.isEmpty( query ) ) {
    return new Promise.reject( new Error('no query string'));
  }

  return new Promise( function( resolve, reject ) {
    request({
      url: SHOWS_URL
    }, function( err, resp, body ) {
      if( err ) return reject(err);

      try {
        var doc = new dom({errorHandler: function(o) {}}).parseFromString( body );
        var shownames_xml = xpath.select( SHOWS_XPATH, doc );
      } catch(err) {
        return reject( new Error('cant parse showrss xml', err) );
      }

      // gives us all the elements
      var shownames = shownames_xml.map( function(e) {
        return e.firstChild ? {
          source: 'showrss',
          mediaType: 'series',
          showRssId: e.getAttribute('value'),
          title: e.firstChild.data
        } : null;
      });

      // gives us just what was searched for
      var shownames_filtered = _.filter( shownames, function( obj ) {
        return obj
              && _.isString( obj.title )
              && obj.title.toLowerCase().indexOf( query.toLowerCase() ) > -1;
      });

      config.logger.info( '[showrss] results: ', shownames_filtered.length );
      resolve( shownames_filtered );
    })
  });
};

ShowRssSource.prototype.addItem = function( item ) {

}

ShowRssSource.prototype.download = function( url ) {
  return this.url( url );
};

module.exports = ShowRssSource;
