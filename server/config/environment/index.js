'use strict';

var path = require('path');
var _ = require('lodash');

function requiredProcessEnv(name) {
  if(!process.env[name]) {
    throw new Error('You must set the ' + name + ' environment variable');
  }
  return process.env[name];
}

// All configurations will extend these options
// ============================================
var all = {
  env: process.env.NODE_ENV || 'development',

  // Root path of server
  root: path.normalize(__dirname + '/../../..'),

  // Server port
  port: process.env.PORT || 9000,

  // Server IP
  ip: process.env.IP || '0.0.0.0',

  // Should we populate the DB with sample data?
  seedDB: false,

  // Secret for session, you will want to change this and make it an environment variable
  secrets: {
    session: 'kapture-secret'
  },

  // List of user roles
  userRoles: ['guest', 'user', 'admin'],

  // MongoDB connection options
  mongo: {
    options: {
      db: {
        safe: true
      }
    }
  },

  // where the system lives
  kaptureHost: 'localhost',

  // keep the trailing slash
  rootDownloadPath : '/media/usb/',
  moviesPath       : 'movies',
  showsPath        : 'tvshows',
  musicPath        : 'music',
  photosPath       : 'photos',
  defaultMediaPath : 'downloads',

  transmissionPort  : 9091,
  transmissonUser   : 'admin',
  transmissionPass  : 'password',

  // where to keep the series file for flexget to use
  seriesFileStore   : 'user_series.yml'

};

// Export the config object based on the NODE_ENV
// ==============================================
module.exports = _.merge(
  all,
  require('./' + process.env.NODE_ENV + '.js') || {});
