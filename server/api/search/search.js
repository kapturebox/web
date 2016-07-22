'use strict';

var Promise = require('bluebird');
var _       = require('lodash');
var config  = require('../../config/environment');

// all of these promises need to resolve, otherwise nothing will
// if failure - ensure empty array is returned
var kat     = require('./sources/kat');
var showrss = require('./sources/showrss');
var tpb     = require('./sources/tpb');

module.exports = function( query ) {
  return Promise.all([
    showrss( query ),
    kat( query ),
    tpb( query )
  ])
  .then(function( arr ) {
    config.logger.debug( 'results array: ', arr );
    // filter out failed sources
    return arr.reduce( function( prev, cur ) {
      return _.concat( prev, _.reject( cur, _.isNull ));
    });
  })
  .catch(function(err) {
    config.logger.error( 'cant get results: ', err.stack );
  });
};
