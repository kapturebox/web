'use strict';

var fs      = require('fs');
var YAML    = require('yamljs');
var util    = require('util');
var config  = require('../../config/environment');

var settingsFile = config.settingsFileStore;

var Plugin = function() {
  this.metadata = {
    pluginId: 'base.plugin'    // should be overridden by plugin
  };
}

Plugin.prototype.get = function( key ) {
  var userKey = 'plugins[\'' + this.metadata.pluginId + '\'].' + key;
  return config.getUserSettings( userKey );
}

Plugin.prototype.set = function( key, value ) {
  var userKey = 'plugins[\'' + this.metadata.pluginId + '\'].' + key;
  return config.setUserSetting( userKey, value );
}


Plugin.prototype.toString = function() {
  return util.format( '%s', this.metadata.pluginName );
}

Plugin.prototype.isEnabled = function() {
  try {
    var settings = YAML.load( settingsFile );
    return Boolean( settings.plugins[this.metadata.pluginId].enabled ) || false;
  } catch ( err ) {
    return false;
  }
};

Plugin.prototype.setEnabled = function( enabled ) {
  var settings = YAML.load( settingsFile );
  settings.plugins[this.metadata.pluginId].enabled = enabled;
  var yaml_str = YAML.stringify( settings );

  return fs.writeFile( settingsFile, yaml_str, function( err ) {
    if( err ) {
      throw Error( '[base.plugin] cant write settings file:', err );
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
