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

  return Promise.allSettled(
    enabled.map(function( plugin ) {
      return plugin.search( query );
    }))
    .then(function( arr ) {
      // filter out failed sources
      var results = arr.reduce( function( prev, cur ) {
        return prev.concat( _.reject( cur, _.isEmpty ) );
      },[]);

      // config.logger.debug( 'merged results array: ', results );

      return results;
    })
};


// taken from http://www.effectiveui.com/blog/2014/11/11/promise-any-a-missing-use-case/
// apparently bluebird doesn't really handle "waiting for all promises and allowing failure"
Promise.allSettled = function(arrayOfPromises) {
  // For each promise that resolves or rejects, 
  // make them all resolve.
  // Record which ones did resolve or reject
  var resolvingPromises = arrayOfPromises.map(function(promise) {
    return promise.then(function(result) {
      return {
        resolve: true,
        result: result
      };
    }, function(error) {
      return {
        resolve: false,
        result: error
      };
    });
  });

  return Promise.all(resolvingPromises).then(function(results) {
    // Count how many passed/failed
    var passed = [], failed = [], allFailed = true;
    results.forEach(function(result) {
      if(result.resolve) {
        allFailed = false;
      } else {
        config.logger.warn( 'search promise returned error:', result.result );
      }
      passed.push(result.resolve ? result.result : null);
      failed.push(result.resolve ? null : result.result);
    });

    if(allFailed) {
      throw failed;
    } else {
      return passed;
    }
  });
};
