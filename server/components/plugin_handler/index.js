'use strict';

var fs      = require('fs');
var _       = require('lodash');
var base    = require('./plugin_base');
var util    = require('util');
var config  = require('../../config/environment');

var PLUGIN_PREFIX = 'server/components/plugins';



module.exports = {
  getEnabledPlugins: function() {
    return _.filter( this.getAllPlugins(), function(p) {
      config.logger.info( '[Plugin:%s] enabled: %s', p.metadata.pluginName, p.isEnabled() );
      return p.isEnabled();
    });
  },

  getAllPlugins: function() {
    return this.getAllPluginFiles().map( function( plugin_name ) {
      var plugin = require( '../plugins/' + plugin_name );
      util.inherits( plugin, base );
      return new plugin();
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
