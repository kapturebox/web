'use strict';

// Production specific configuration
// =================================
module.exports = {
  // Server IP
  ip:       process.env.OPENSHIFT_NODEJS_IP ||
            process.env.IP ||
            undefined,

  // Server port
  port:     process.env.OPENSHIFT_NODEJS_PORT ||
            process.env.PORT ||
            8080,

  // MongoDB connection options
  mongo: {
    uri:    process.env.MONGOLAB_URI ||
            process.env.MONGOHQ_URL ||
            process.env.OPENSHIFT_MONGODB_DB_URL+process.env.OPENSHIFT_APP_NAME ||
            'mongodb://localhost/kapture'
  },

  kaptureHost: 'localhost',


  // where to keep the series file for flexget to use
  seriesFileStore   : '/etc/kapture/user_series.yml',

  // settings that will be used by ansible here
  settingsFileStore : '/etc/kapture/system_settings.yml'

};
