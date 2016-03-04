'use strict';

angular.module('kaptureApp')
  .controller('SettingsDialogController', function ($scope, $mdDialog, $http, $mdToast) {

  $scope.close = function() {
    $mdDialog.hide();
  };

  $http({
    method: 'GET',
    url:    '/api/settings'
  }).then(function(results) {
    $scope.settings = results.data;
  });

  $scope.applyingSettings = false;

  $scope.submitSettings = function(  ) {
    $scope.applyingSettings = true;
    if( $scope.settingsForm.$valid ) {
      $http({
        method:    'POST',
        url:       '/api/settings',
        data:      $scope.settings,
        headers:   { 'Content-Type': 'application/json' }
      }).then(function(response) {
        $scope.applyingSettings = false;
        $scope.close();

        $mdToast.show(
          $mdToast.simple()
            .textContent( 'Settings saved successfully!' )
            .hideDelay( 2000 )
        );
      }).catch(function(err) {
        $scope.applyingSettings = false;
        $mdToast.show(
          $mdToast.simple()
            .textContent( 'Unable to save settings' )
            .hideDelay( 2000 )
        );
      });
    }
  }

});
