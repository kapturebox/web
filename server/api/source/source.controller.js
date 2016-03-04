'use strict';

var _ = require('lodash');
var request = require('request');

// Get list of sources
exports.getSources = function(req, res) {
  res.json([]);
};

exports.putSource = function(req, res) {
  res.json([]);
};

//TODO: needs to detect the source type first..
exports.listSourceEntries = function(req, res) {
  var url = req.query.url;
  console.log(url);

  request( url, function( err, response, body) {
    if( err || response.statusCode != 200 ) {
      res.status(500).json({ error: err });
    } else {
      var parseXml = require('xml2js').parseString;
      parseXml( body, function( err, result ) {
        if( err ) {
          res.status(500).json({ error: err });
        } else {
          res.status(200).json( {items: result.rss.channel[0].item });
        }
      })
    }
  })
};

exports.deleteSource = function(req, res) {
  res.json([]);
};
