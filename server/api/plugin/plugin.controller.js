'use strict';

var _ = require('lodash');
var plugins = require('../../components/plugin_handler');

// Get list of plugins
exports.index = function(req, res) {
  var availablePlugins = plugins.getAllPlugins().map( function( item ) {
    return item.search('suckit');
  });

  res.status(200).json( availablePlugins );
};
