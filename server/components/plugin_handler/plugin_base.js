'use strict';

var fs      = require('fs');
var YAML    = require('yamljs');
var config  = require('../../config/environment');

var settingsFile = config.settingsFileStore;

var Plugin = function() {
  this.metadata = {
    pluginId: 'base.plugin'    // should be overridden by plugin
  };
  return this;
}

Plugin.prototype.isEnabled = function() {
  var settings = YAML.load( settingsFile );

  return settings
    && settings.plugins
    && settings.plugins[this.pluginId]
    && settings.plugins[this.pluginId].enabled;
};

Plugin.prototype.setEnabled = function( enabled ) {
  var settings = YAML.load( settingsFile );
  settings.plugins[this.pluginId].enabled = enabled;
  var yaml_str = YAML.stringify( settings );

  return fs.writeFile( settingsFile, yaml_str, function( err ) {
    if( err ) {
      throw Error('[base.plugin] cant write settings file:', err );
    }
  });
};


Plugin.prototype.enable = function() {
  this.setEnabled( true );
};

Plugin.prototype.disable = function() {
  this.setEnabled( false );
};

module.exports = Plugin;
