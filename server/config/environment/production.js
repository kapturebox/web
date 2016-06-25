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

  kaptureHost: 'localhost',



  // settings that will be used by ansible here
  settingsFileStore : '/etc/kapture/system_settings.yml',


  // where to keep the series file for flexget to use
  seriesFileStore         : '/etc/kapture/user_series.yml',          //flexget
  seriesMetadataFileStore : '/etc/kapture/user_series_metadata.yml'  //kapture

};
