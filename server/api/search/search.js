'use strict';

var Promise = require('bluebird');
var _       = require('lodash');
var config  = require('../../config/environment');

// all of these promises need to resolve, otherwise nothing will
// if failure - ensure empty array is returned



module.exports = function( query ) {
  var plugins = require('../../components/plugin_handler').getEnabledPlugins();

  return Promise.all(
    plugins.map(function( plugin ) {
      return plugin.search( query );
    }))
  .then(function( arr ) {
    config.logger.debug( 'results array: ', arr );
    // filter out failed sources
    return arr.reduce( function( prev, cur ) {
      return _.concat( prev, _.reject( cur, _.isEmpty ));
    },[]);
  })
  .catch(function( err ) {
    config.logger.error( 'cant get results: ', err );
  });
};
