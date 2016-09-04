'use strict';

var _               = require('lodash');
var config          = require('../../config/environment');



// store settings for ansible
exports.postSettings = function( req, res, next ) {
  try {
    config.setUserSetting( req.body );
    return res.status(200).send();
  } catch( err ) {
    return res.status(500).json( err );
  }
};

// get settings from ansible
exports.getSettings = function( req, res, next ) {
  res.status(200).json( config.getUserSetting() );
};
