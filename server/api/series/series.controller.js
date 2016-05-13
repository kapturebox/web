'use strict';

var _       = require('lodash');
var YAML    = require('yamljs');
var config  = require('../../config/environment');
var fs      = require('fs');
var request = require('request');
var util    = require('util');
var Promise = require('bluebird');
var xml2js  = require('xml2json');



// Get list of seriess
exports.index = function(req, res) {
  console.log( '[showrss] getting series' );

  try {
    var seriesObj = YAML.load( config.seriesFileStore );
    res.status(200).json( seriesObj );
  } catch ( err ) {
    res.status(200).json([]);
  }
};



exports.getSeriesInfo = function(req, res) {
  var seriesReq = req.params.id;

  if( _.isEmpty( seriesReq ) ) {
    return res.status(500).json({error: 'no show id provided' });
  }

  // %d is the id # as stored by showrss
  var SHOW_HISTORY_DATA_URL = 'http://showrss.info/feeds/%d.rss';

  request({
    url: util.format( SHOW_HISTORY_DATA_URL, seriesReq )
  }, function( err, resp, body ) {
    if( err ) {
      return res.status(500).json({ error: err });
    }

    try {
      var ugly_items = xml2js.toJson( body, {object:true} ).rss.channel;
      var items      = ugly_items['item'];

      var filtered   = items.map( function(e) {
        return {
          title: e.title,
          hashString: e['showrss:info_hash'],
          uploaded: e.pubDate,
          rawTitle: e['showrss:rawtitle'],
          magnetUrl: e.link
        };
      });

      res.status(200).json( filtered );
    } catch(err) {
      return res.status(500).json({ error: 'cant parse showrss xml: ' + err });
    }
  });
}

exports.addSeries = function( req, res ) {
  var newSeries = req.body.item.title;
  console.log( '[showrss] saving: ', newSeries );

  readSeriesMetaDataFile()
    .then(function( seriesMetadataObj ) {
      seriesMetadataObj.series.push( newSeries );
      seriesMetadataObj.series = _.uniq( seriesMetadataObj.series );
      return writeSeriesMetadataFile( seriesMetadataObj );
    })
    .then(function( seriesMetadataObj ) {
      console.log( 'metadata file: ', seriesMetadataObj );
      return writeFlexGetSeriesFile( seriesMetadataObj );
    })
    .then( function() {
      return res.status(200).send();
    })
    .catch( function( err ) {
      return res.status(500).json( {error: err} );
    });
}

function readSeriesMetaDataFile() {
  return new Promise(function( resolve, reject ) {
    try {
      var seriesObj = YAML.load( config.seriesMetadataFileStore );
      resolve( seriesObj );
    } catch( err ){
      return resolve( seriesMetadataFileDefault() );
    }
  });
}

function writeSeriesMetadataFile( seriesMetadataObj ) {
  return new Promise(function( resolve, reject ) {
    var yamlStr = YAML.stringify( seriesMetadataObj );
    fs.writeFileSync( config.seriesMetadataFileStore, yamlStr, function( err ) {
      if( err ) return reject( new Error( 'string'+err ));
      return resolve( seriesMetadataObj );
    });
  });
}

function writeFlexGetSeriesFile( seriesMetadataObj ) {
  return new Promise(function( resolve, reject ) {
    var seriesObj = _.pick( seriesMetadataObj.series, 'name' );
    var yamlStr = YAML.stringify( seriesObj );

    fs.writeFileSync( config.seriesFileStore, yamlStr, function( err ) {
      if( err ) return reject( new Error( err ));
      return resolve( seriesObj );
    });
  });
}


function seriesMetadataFileDefault() {
  return {
    series: []
  };
}
