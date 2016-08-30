'use strict';

var Promise = require('bluebird');
var request = require('request');
var _       = require('lodash');
var util    = require('util');

var xpath = require('xpath');
var dom   = require('xmldom').DOMParser;
var xml2js  = require('xml2json-light');


var ShowRssSource = function( options ) {
  this.metadata = {
    pluginId: 'info.showrss',                 // Unique ID of plugin
    pluginName: 'ShowRss',                    // Display name of plugin
    pluginTypes: ['source','series'],         // 'source', 'downloader', 'player'
    sourceType: 'continuous',                 // 'adhoc', 'continuous'
    link: 'http://showrss.info/',             // Link to provider site
    description: 'Updated feed of TV shows'   // Description of plugin provider
  };

  ShowRssSource.super_.apply( this, arguments );

  return this;
}



ShowRssSource.prototype.search = function( query ) {
  var self        = this;
  var SHOWS_URL   = 'http://showrss.info/browse';
  var SHOWS_XPATH = '//*[@id="showselector"]/option';

  if( _.isEmpty( query ) ) {
    return Promise.reject( new Error('no query string'));
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

      var shownames = _.filter( shownames_xml, function( e ){
        return e.firstChild !== undefined; 
      }).map(function( e ) {
        return {
          sourceId:     self.metadata.pluginId,
          sourceName:   self.metadata.pluginName,
          flexgetModel: 'showrss',
          mediaType:    'series',
          id:           e.getAttribute('value'),
          title:        e.firstChild.data
        };
      });

      // gives us just what was searched for
      var shownames_filtered = _.filter( shownames, function( obj ) {
        return obj
              && _.isString( obj.title )
              && obj.title.toLowerCase().indexOf( query.toLowerCase() ) > -1;
      });

      self.logger.info( '[showrss] results: ', shownames_filtered.length );
      resolve( shownames_filtered );
    })
  });
};



ShowRssSource.prototype.status = function() {
  return Promise.resolve([]);  // uses torrent downloader and flexget
}

ShowRssSource.prototype.download = function( item ) {
  return this.add( item );
};

ShowRssSource.prototype.remove = function( item ) {
  var self = this;
  return new Promise(function(resolve, reject) {
    try {
      self.removeState( item.id );
      resolve( item );
    } catch ( err ) {
      reject( new Error( err.toString() ));
    }    
  });
}



///////////////////
// SERIES SPECIFIC
///////////////////


// %d is the id # as stored by showrss
const SHOW_HISTORY_DATA_URL = 'https://showrss.info/show/%d.rss';
const UPCOMING_EPISODES_URL = 'https://showrss.info/show/schedule/%d.rss';


ShowRssSource.prototype.info = function( showId ) {
  var self = this;
  return new Promise(function(resolve, reject) {
    request({
      url: util.format( SHOW_HISTORY_DATA_URL, showId )
    }, function( err, resp, body ) {
      if( err ) {
        return reject(new Error( err.toString() ));
      }

      try {
        var ugly_items = xml2js.xml2json( body ).rss.channel;
        var items      = ugly_items['item'];

        if( ! items ) {
          return reject(new Error( 'unable to find any entries in rss feed' ));
        }

        var transformed = items.map( function(e) {
          return {
            title:        e['title'],
            hashString:   e['showrss:info_hash'],
            uploaded:     e['pubDate'],
            rawTitle:     e['showrss:rawtitle'],
            magnetUrl:    e['link']
          };
        });

        resolve( transformed );
      } catch( err ) {
        return reject(new Error( 'cant parse showrss xml' ));
      }
    });
  });
}

ShowRssSource.prototype.add = function( item ) {
  var self = this;
  return new Promise(function(resolve, reject) {
    try {
      self.setState( item.id, item );
      // trigger update to flexget
      resolve( item );
    } catch ( err ) {
      reject( new Error( err.toString() ));      
    }
  });

}

ShowRssSource.prototype.getEnabledSeriesNames = function() {
  return this.getState().map(function(e){
    return e.title;
  });
}

ShowRssSource.prototype.getEnabledSeries = function() {
  return this.getState();
}


ShowRssSource.prototype.flexgetModel = function() {
  var self = this;
  return {
    showRssTask: {
      rss: {
        url: 'http://showrss.info/feeds/all.rss',
        other_fields: [
          'showrss:showname'
        ]},
      manipulate: [{
        series_name: {
          from: 'showrss:showname'
        }
      }],
      series: self.getEnabledSeriesNames(),
      transmission: {
        host: 'localhost',
        port: 9091,
        username: 'admin',
        password: 'password',
        path: '/tmp/tvshows'
      }
    }
  }
}




////////////////
// Maybe trash?
////////////////


// ShowRssSource.prototype.url = function( url ) {
// };

// ShowRssSource.prototype.urlMatches = function( url ) {
//   return false;
// };


module.exports = ShowRssSource;
