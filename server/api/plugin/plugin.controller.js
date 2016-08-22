'use strict';

var _       = require('lodash');
var plugins = require('../../components/plugin_handler');
var config  = require('../../config/environment');

// Get list of plugins
exports.index = function(req, res) {
  res.status(200).json( getPluginInfo() );
};


// change settings for particular plugin
exports.put = function( req, res ) {
  try {
    var id = req.params.plugin_id;

    Object.keys( req.body ).forEach(function(e) {
      return plugins.getPlugin( id ).set( e, req.body[e] );
    })

    return res.status(200).send();
  } catch( err ) {
    return res.status(500).json({ error: err.toString() });
  }
}

exports.get = function( req, res ) {
  res.status(200).json( getPluginInfo( req.params.plugin_id ) );
}

function getPluginInfo( p ) {
  if( p ) {
    var plugin = plugins.getPlugin( p );
    return _.merge( plugin.metadata, {enabled: plugin.isEnabled()} );
  } else {
    return plugins.getAllPlugins().map(function( plugin ) {
      return _.merge( plugin.metadata, {enabled: plugin.isEnabled()} );
    });
  }
}
