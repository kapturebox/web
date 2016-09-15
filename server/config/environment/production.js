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

  pluginStateStore: '/var/lib/kapture/pluginStateStore',

  ngrokEnabled   : true,
  ngrokAuthToken : '4zXtTSp3aErR86ukMNcsy_2ieJPJszU3pUW3irbHDRY'  // ngrok user: evin.callaha@gmail.com

};
