'use strict';

var fs   = require('fs');
var _    = require('lodash');
var base = require('./plugin_base');
var util = require('util');

var PLUGIN_PREFIX = 'server/components/plugins';



module.exports = {
  getAllPlugins: function() {
    return this.getAllPluginFiles().map( function( plugin ) {
      var pluginObj = _.extend( require( '../plugins/' + plugin ), new base() );
      return new pluginObj();
    })
  },

  getAllPluginFiles: function() {
    return fs.readdirSync( PLUGIN_PREFIX );
  },

  getPlugin: function( pluginId ) {
    return _.filter( this.getAllPlugins(), {
      metadata: {
        pluginId: pluginId
      }
    });
  }
}
