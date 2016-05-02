var Promise = require('bluebird');
var request = require('request');
var _       = require('lodash');

var xpath = require('xpath')
var dom   = require('xmldom').DOMParser


module.exports = function ( query ) {
  var SHOWS_URL   = 'https://showrss.info/?cs=feeds';
  var SHOWS_XPATH = '//select[@class="chosen"]/option';

  return new Promise( function( resolve, reject ) {
    request({
      url: SHOWS_URL
    }, function( err, resp, body ) {
      if( err ) reject(err);

      var doc = new dom({errorHandler: function(o) {}}).parseFromString( body );
      var shownames_xml = xpath.select( SHOWS_XPATH, doc );

      // gives us all the elements
      var shownames = shownames_xml.map( function(e) {
        return e.firstChild ? {
          source: 'showrss',
          mediaType: 'tvshow',
          title: e.firstChild.data
        } : null;
      });

      // gives us just what was searched for
      var shownames_filtered = _.filter( shownames, function( obj ) {
        return obj
              && _.isString( obj.title )
              && obj.title.toLowerCase().indexOf( query.toLowerCase() ) > -1;
      });

      resolve( shownames_filtered );
    })
  });
}
