'use strict';

var _ = require('lodash');
var search = require('./search');
var config = require('../../config/environment')


// Get list of searchs
exports.search = function( req, res, next ) {
  var query = req.query.q;
  config.logger.info( 'search query: %s', query );

  search( query )
    .then(function( results ) {
      return res.status(200).json( results );
    })
    .catch(function( err ) {
      return next(new Error( err ));
    });
};
