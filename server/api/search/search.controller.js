'use strict';

var _ = require('lodash');
var search = require('./search');


// Get list of searchs
exports.search = function(req, res) {
  var query = req.query.q;
  console.log( 'Search query: %s', query );

  search( query )
    .then(function( results ) {
      res.status(200).json( results );
    })
    .catch(function( err ) {
      res.status(500).json( err );
    });
};
