'use strict';

var fs      = require('fs');
var YAML    = require('yamljs');
var persist = require('node-persist');
var util    = require('util');
var path    = require('path');
var config  = require('../../config/environment');

var settingsFile     = config.settingsFileStore;
var stateStorePath   = config.pluginStateStore;



var Plugin = function() {
  this.config   = config;
  this.logger   = config.logger;

  try {
    this.stateStore = persist.create({
      dir: path.join( stateStorePath, this.metadata.pluginId || 'base' ),
      interval: 2000 // 2s save to disk interval
    });
    this.stateStore.initSync();
  } catch( err ) {
    this.logger.error( 'unable to init state store: %s', err.toString() );
  }

  return this;
}



Plugin.prototype.get = function( key ) {
  var userKey = 'plugins[\'' + this.metadata.pluginId + '\'].' + key;
  return this.config.getUserSettings( userKey );
}



Plugin.prototype.set = function( key, value ) {
  var userKey = 'plugins[\'' + this.metadata.pluginId + '\'].' + key;
  return this.config.setUserSetting( userKey, value );
}



Plugin.prototype.setState = function( key, value ) {
  return this.stateStore.setItemSync( key, value );
}



Plugin.prototype.getState = function( key ) {
  if( ! key ) { // then return array of all
    return this.stateStore.values();
  } else {
    return this.stateStore.getItemSync( key );
  }
}


Plugin.prototype.removeState = function( key ) {
  return this.stateStore.removeItemSync( key );
}



Plugin.prototype.toString = function() {
  return util.format( '%s', this.metadata.pluginName );
}


Plugin.prototype.isEnabled = function() {
  return this.get( 'enabled' ) || false;
};


Plugin.prototype.enable = function() {
  return this.set( 'enabled', true );
};


Plugin.prototype.disable = function() {
  return this.set( 'enabled', false );
};


module.exports = Plugin;
