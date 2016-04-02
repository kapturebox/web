'use strict';

var _ = require('lodash');
var search = require('./search');

var ref_response = [
  {source: 'showrss', title: 'Always Sunny in Philledelphia', uploaded: Date.now(), mediaType: 'video', series: true},
  {source: 'piratebay', title: 'South Park', uploaded: Date.now(), mediaType: 'video', size: 1203767178},
  {source: 'kickass', title: 'Family guy', mediaType: 'video', category: 'Comedy'},
  {source: 'kickass', title: 'Jay-Z Black Album', uploaded: new Date('2014-09-20Z12:31:10+0000'), mediaType: 'audio'},
  {title: 'Puff Daddy - No Way Out', uploaded: new Date('2014-09-20Z12:31:10+0000'), mediaType: 'audio'},
];



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
