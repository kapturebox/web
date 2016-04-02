'use strict';

var request = require('request');
var util = require('util');
var Promise = require('bluebird');

module.exports = function( query ) {
  return kat( query );
};

function kat( query ) {
  var KAT_URL = 'https://kat.cr/json.php';

  return new Promise( function( resolve, reject ) {
    request({
      url: KAT_URL,
      json: true,
      qs: {
        q: query,
        field: 'seeders',
        sort: 'desc'
      }
     },
     function( err, resp, body ) {
      if (!err && resp.statusCode == 200) {
        console.log('Results from KAT: %d', body.total_results );

        resp = transformKatResults( body.list );

        resolve( resp );
      } else {
        reject( err );
      }
    });
  });

};

function transformKatResults( jsonResults ) {
  return jsonResults.map(function( d ) {
    return {
      source: 'Kickass',
      title: d.title,
      uploaded: d.pubDate,
      category: d.category,
      mediaType: determineKatMediaType( d ),
      size: d.size,
      downloadUrl: d.torrentLink,
      hash: d.hash,
      peers: d.peers,
      score: d.votes
    }
  });
};

function determineKatMediaType( elem ) {
  switch( elem.category ) {
    case 'Movies':
    case 'TV':
    case 'Anime':
    case 'XXX':
      return 'video';
      break;
    case 'Music':
      return 'audio';
      break;
    default:
      return 'unknown';
      break;
  }
}
