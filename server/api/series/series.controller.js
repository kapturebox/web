'use strict';

var _       = require('lodash');
var util    = require('util');
var Promise = require('bluebird');
var plugins = require('../../components/plugin_handler');



// Get list of seriess
exports.index = function(req, res) {
  try {
    var series = plugins.getEnabledSeriesProviders().map(function(p) {
      return p.getEnabledSeries();
    }).reduce(function( last,cur ) {
      return last.concat( cur );
    },[]);

    res.status(200).json( series );
  } catch ( err ) {
    return next( err );    
  }
};

exports.deleteSeries = function( req, res, next ) {
  plugins.getPlugin( req.body.item.sourceId )
    .remove( req.body.item )
    .then(function( item ) {
      res.status(200).json( item );
    }).catch(function(err) {
      return next( err );    
    });
};


exports.getSeriesInfo = function( req, res, next ) {
  plugins.getPlugin( req.params.pluginId )
    .info( req.params.showId )
    .then(function( info ) {
      res.status(200).json( info );
    }).catch(function( err ) {
      return next( err );    
    });
  
}

exports.addSeries = function( req, res, next ) {
  plugins.getPlugin( req.body.item.sourceId )
    .add( req.body.item )
    .then(function( item ) {
      res.status(200).json( item );
    }).catch(function(err) {
      return next( err );    
    });
}

