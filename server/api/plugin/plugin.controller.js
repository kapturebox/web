'use strict';

var _       = require('lodash');
var plugins = require('../../components/plugin_handler');
var config  = require('../../config/environment');

// Get list of plugins
exports.index = function(req, res) {
  var availablePlugins = plugins.getAllPlugins();
  res.status(200).json( availablePlugins );
};

exports.put = function( req, res ) {
  var id = req.params.plugin_id;
  var setting = req.body;

  plugins.getPlugin( id ).set( setting );
}

exports.get = function( req, res ) {
  var plugin = plugins.getPlugin( req.params.plugin_id );
  res.status(200).json( plugin );
}
