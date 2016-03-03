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

  $scope.submitSettings = function(  ) {
    if( $scope.settingsForm.$valid ) {
      $http({
        method:    'POST',
        url:       '/api/settings',
        data:      $scope.settings,
        headers:   { 'Content-Type': 'application/json' }
      }).then(function(response) {
        //TODO: show loading dialog while ansible runs
        $scope.close();
        $mdToast.show(
          $mdToast.simple()
            .textContent( 'Settings saved successfully!' )
            .hideDelay( 2000 )
        );
      }).catch(function(err) {
        $mdToast.show(
          $mdToast.simple()
            .textContent( 'Unable to save settings' )
            .hideDelay( 2000 )
        );
      });
    }
  }

});
