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
    return _.find( this.getAllPlugins(), {
      metadata: {
        pluginId: pluginId
      }
    });
  },

  // gets first download provider that matches specific mechanism
  getDownloadMechanismProvider: function( downloadMechanism ) {
    return _.find( this.getEnabledPlugins(), function(p) {
      return _.includes( p.metadata.pluginTypes, 'downloader' )
          && _.includes( p.metadata.downloadProviders, downloadMechanism );
    });
  },

  getEnabledDownloaders: function() {
    return _.reject( this.getEnabledPlugins(), function( p ) {
      return ! _.includes( p.metadata.pluginTypes, 'downloader' );
    });
  },

  getEnabledSources: function() {
    return _.find( this.getEnabledPlugins(), function(p) {
      return _.includes( p.metadata.pluginTypes, 'source' );
    });
  }
}
