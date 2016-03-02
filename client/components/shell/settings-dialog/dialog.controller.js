'use strict';

angular.module('kaptureApp')
  .controller('SettingsDialogController', function ($scope, $mdDialog) {

  $scope.close = function() {
    $mdDialog.hide();
  };

  $scope.settings = {
    systemname: "kapturebox"
  }

});
