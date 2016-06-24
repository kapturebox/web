'use strict';

var fs      = require('fs');
var YAML    = require('yamljs');
var config  = require('config');

var settingsFile = config.settingsFileStore;

module.exports = {
  isEnabled: function() {
    var settings = YAML.load( settingsFile );

    return settings
      && settings.plugins
      && settings.plugins[this.pluginId]
      && settings.plugins[this.pluginId].enabled;
  }

  enable: function( enabled ) {
    var settings = YAML.load( settingsFile );
    settings.plugins[this.pluginId].enabled = enabled;
    var yaml_str = YAML.stringify( settings );

    fs.writeFile( settingsFile, yaml_str, function( err ) {
      if( err ) {
        throw Error('[plugin_base] cant write settings file:', err );
      }
    });
  }
}
