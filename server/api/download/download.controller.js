'use strict';

var _       = require('lodash');
var request = require('request');
var Promise = require('bluebird');
var YAML    = require('yamljs');
var fs      = require('fs');

var plugins = require('../../components/plugin_handler');
var config = require('../../config/environment');

var DownloadService = require('../../components/download_service');



/////////////////////////////////////////
// Start of Express entry points
/////////////////////////////////////////

// remove download from system, with switch to delete from FS if desired
exports.removeDownload = function( req, res, next ) {
  DownloadService.remove( req.body.item, req.body.deleteFileOnDisk )
    .then(function( resp ) {
      res.status(200).json( resp );
      return resp;
    })
    .catch( function( err ) {
      res.status(500).json({ error: err.toString() });
      return next( err );
    })
}


// starts a new download of given item, expecting a specific 'downloadMechanism'
exports.addDownload = function( req, res, next ) {
  DownloadService.add( req.body.item )
    .then( function( resp ) {
      // intention here is to allow plugins to ask for 'more info' if desired
      // or return whatever they want

      res.status(200).json( resp );
      return resp;
    })
    .catch( function( err ) {
      res.status(500).json({ error: err.toString() });
      return next( err );
    });
};

// get status of all downloads tracked
exports.getDownloads = function( req, res, next ) {
  DownloadService.status()
    .then( function( results ) {
      res.status(200).json( results );
      return results;
    })
    .catch( function( err ) {
      res.status(500).json({ error: err.toString() });
      return next( err );
    });
}
