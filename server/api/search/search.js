'use strict';

var Promise = require('bluebird');
var _       = require('lodash');
var config  = require('../../config/environment');

var plugins = require('../../components/plugin_handler');

// all of these promises need to resolve, otherwise nothing will
// if failure - ensure empty array is returned
module.exports = function( query ) {
  var enabled = plugins.getEnabledSources();
  config.logger.info( 'searching with enabled sources: %s', enabled );

  return Promise.all(
    enabled.map(function( plugin ) {
      return plugin.search( query );
    }))
    .then(function( arr ) {
      // filter out failed sources
      var results = arr.reduce( function( prev, cur ) {
        return prev.concat( cur );
      },[]);

      // config.logger.debug( 'merged results array: ', results );

      return results;
    })
    .catch(function( err ) {
      config.logger.error( 'cant get results: ', err );
    });
};
