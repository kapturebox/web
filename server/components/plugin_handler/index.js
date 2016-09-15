'use strict';

var fs      = require('fs');
var _       = require('lodash');
var path    = require('path');
var util    = require('util');
var base    = require('./plugin_base');
var config  = require('../../config/environment');

var PLUGIN_PREFIX = path.join( process.cwd(), 'components/plugins' );



module.exports = {
  getEnabledPlugins: function() {
    return _.filter( this.getAllPlugins(), function(p) {
      return p.isEnabled();
    });
  },

  getAllPlugins: function() {
    var self = this;
    return this.getAllPluginFiles().map( function( plugin_name ) {
      var plugin = require( '../plugins/' + plugin_name );
      util.inherits( plugin, base );

      plugin.prototype.pluginHandler = self;
      var newPluginObj = new plugin();

      return newPluginObj;
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
    return _.filter( this.getEnabledPlugins(), function( p ) {
      return _.includes( p.metadata.pluginTypes, 'downloader' );
    });
  },

  getEnabledSources: function() {
    return _.filter( this.getEnabledPlugins(), function(p) {
      return _.includes( p.metadata.pluginTypes, 'source' );
    });
  },

  getEnabledSeriesProviders: function() {
    return _.filter( this.getEnabledPlugins(), function(p) {
      return _.includes( p.metadata.pluginTypes, 'series' );
    });    
  }

  
}
