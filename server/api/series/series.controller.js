'use strict';

var _       = require('lodash');
var YAML    = require('yamljs');
var config  = require('../../config/environment');
var fs      = require('fs');
var request = require('request');
var util    = require('util');
var Promise = require('bluebird');
var xml2js  = require('xml2json-light');



// Get list of seriess
exports.index = function(req, res) {
  console.log( '[showrss] getting series' );

  try {
    var seriesObj = YAML.load( config.seriesMetadataFileStore );
    res.status(200).json( seriesObj );
  } catch ( err ) {
    res.status(200).json([]);
  }
};

exports.deleteSeries = function( req, res ) {
  var seriesToDelete = req.params.id;

  if( _.isEmpty( seriesToDelete ) ) {
    return res.status(500).json({error: 'no show id provided' });
  }

  console.log( '[showrss] saving: ', seriesToDelete );

  readSeriesMetaDataFile()
    .then(function( seriesMetadataObj ) {
      seriesMetadataObj.series = _.reject( seriesMetadataObj.series, {showRssId: seriesToDelete} );
      return writeSeriesMetadataFile( seriesMetadataObj );
    })
    .then(function( seriesMetadataObj ) {
      return writeFlexGetSeriesFile( seriesMetadataObj );
    })
    .then( function() {
      return res.status(200).send();
    })
    .catch( function( err ) {
      return res.status(500).json( {error: err} );
    });
}



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
      var ugly_items = xml2js.xml2json( body ).rss.channel;
      var items      = ugly_items['item'];

      if( ! items ) {
        return res.status(200).json({});
      }

      var filtered   = items.map( function(e) {
        return {
          title: e.title,
          hashString: e['showrss:info_hash'],
          uploaded: e.pubDate,
          rawTitle: e['showrss:rawtitle'],
          magnetUrl: e.link
        };
      });

      return res.status(200).json( filtered );
    } catch(err) {
      return res.status(500).json({ error: 'cant parse showrss xml: ' + err });
    }
  });
}

exports.addSeries = function( req, res ) {
  var newSeries = req.body.item;
  console.log( '[showrss] saving: ', newSeries.title );

  readSeriesMetaDataFile()
    .then(function( seriesMetadataObj ) {
      seriesMetadataObj.series.push( newSeries );
      seriesMetadataObj.series = _.uniqBy( seriesMetadataObj.series, 'showRssId' );
      return writeSeriesMetadataFile( seriesMetadataObj );
    })
    .then(function( seriesMetadataObj ) {
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
    try {
      var yamlStr = YAML.stringify( seriesMetadataObj );
      fs.writeFile( config.seriesMetadataFileStore, yamlStr, function( err ) {
        if( err ) return reject( new Error( err ));
        return resolve( seriesMetadataObj );
      });
    } catch( err ) {
      console.error( err );
      return reject( err );
    }
  });
}

function writeFlexGetSeriesFile( seriesMetadataObj ) {
  return new Promise(function( resolve, reject ) {
    seriesMetadataObj.series = seriesMetadataObj.series.map( function(e) {
      return e.title;
    });
    console.log(seriesMetadataObj);
    var yamlStr = YAML.stringify( seriesMetadataObj );

    fs.writeFile( config.seriesFileStore, yamlStr, function( err ) {
      if( err ) return reject( new Error( err ));
      return resolve( seriesMetadataObj );
    });
  });
}


function seriesMetadataFileDefault() {
  return {
    series: []
  };
}
