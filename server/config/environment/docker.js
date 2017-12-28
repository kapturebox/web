'use strict';

// Development specific configuration
// ==================================
module.exports = {
  pluginStateStore: process.env.KAPTURE_PLUGIN_STORE || '/config/pluginStateStore',
  settingsFileStore : '/config/system_settings.yml',
  userSettingDefaults: {
    rootDownloadPath: process.env.KAPTURE_DOWNLOAD_PATH || '/media',
  }
};
