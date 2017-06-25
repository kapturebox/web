'use strict';

// Development specific configuration
// ==================================
module.exports = {
  pluginStateStore: process.env.KAPTURE_PLUGIN_STORE || '/config/pluginStateStore',

  port: process.env.PORT || 9000,

  // some user setting stuff
  userSettingDefaults: {
    systemname              : 'kapture',
    flexget_check_frequency : 15,
    email                   : null,
    rootDownloadPath        : process.env.KAPTURE_DOWNLOAD_PATH || '/media',
    moviesPath              : 'movies',
    showsPath               : 'tvshows',
    musicPath               : 'music',
    photosPath              : 'photos',
    defaultMediaPath        : 'downloads',
    plugins                 : {
      'com.piratebay': {
        enabled: true
      },
      'com.youtube': {
        enabled: true
      },
      'info.showrss': {
        enabled: true
      },
      'com.transmissionbt': {
        enabled: true,
        transmission_host: process.env.TRANSMISSION_HOST || 'transmission',
        transmission_port: process.env.TRANSMISSION_PORT || 9091,
        transmission_user: process.env.TRANSMISSION_USER || 'admin',
        transmission_pass: process.env.TRANSMISSION_PASS || 'password',
      },
      'com.flexget': {
        enabled: true,
        api_token: process.env.FLEXGET_API_TOKEN || 'api_token',
        flexget_user: process.env.FLEXGET_USERNAME || 'flexget',
        flexget_pass: process.env.FLEXGET_PASSWORD || 'my super password',
        flexget_host: process.env.FLEXGET_HOST || 'flexget',
        flexget_port: process.env.FLEXGET_PORT || 5050
      },
      'com.kapture.url': {
        enabled: true
      }
    }
  },  

};
