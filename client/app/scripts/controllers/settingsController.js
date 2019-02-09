'use strict';
/**
 * @ngdoc function
 * @name kaptureApp.controller:SettingsCtrl
 * @description
 * # SettingsCtrl
 * Controller of the Settings page
 */
angular.module('kaptureApp')
  .controller('SettingsCtrl', ['$scope', '$http', '$log', 'serverEndpoint', function( $scope, $http, $log, serverEndpoint ) {
    var SETTINGS_URI = '/api/settings';
    var PLUGINS_URI  = '/api/plugin';

    $scope.plugins = [];
    $scope.settings = {};

    $scope.setPluginEnabled = function( idx, enabled ) {
      $scope.plugins[idx].changing = true;
      updatePluginSetting( $scope.plugins[idx].pluginId, {enabled: enabled} );
      getPluginState();
    }

    function updatePluginSetting( pluginId, settingObj ) {
      return $http({
        method: 'PUT',
        url:    PLUGINS_URI + '/' + pluginId,
        json:   true,
        data:   settingObj
      }).then(function( resp ) {
        return resp.data;
      })
    }

    function getSettingState() {
      return $http({
        method: 'GET',
        url: SETTINGS_URI
      }).then(function( resp ) {
        $scope.settings = resp.data;
        return resp.data;
      });
    }

    function getPluginState() {
      return $http({
        method: 'GET',
        url: PLUGINS_URI
      }).then(function( resp ) {
        $scope.plugins = resp.data;
        return resp.data;
      });
    }

    // init
    getPluginState();
    getSettingState();
	}]);
