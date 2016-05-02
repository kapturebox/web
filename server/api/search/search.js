'use strict';

var Promise = require('bluebird');
var _       = require('lodash');

var kat     = require('./sources/kat');
var showrss = require('./sources/showrss');

module.exports = function( query ) {
  return Promise.all([
    showrss( query ),
    kat( query )
  ])
  .then(function( arr ){
    console.log( 'Results from showrss: ', arr[0].length );
    console.log( 'Results from kat: ', arr[1].length );

    return _.concat( arr[0], arr[1] );
  })
  .catch(function(err) {
    console.error( 'cant get results: ', err.stack );
  });
};
