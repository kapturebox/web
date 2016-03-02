'use strict';

angular.module('kaptureApp')
  .controller('SettingsDialogController', function ($scope, $mdDialog, $http, $mdToast) {

  $scope.close = function() {
    $mdDialog.hide();
  };

  $scope.settings = {
    systemname: "kapturebox"
  }

  $scope.submitSettings = function(  ) {
    if( $scope.settingsForm.$valid ) {
      $http({
        method:    'POST',
        url:       '/api/settings',
        data:      $scope.settings
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
