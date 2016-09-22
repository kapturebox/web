'use strict';

angular.module('kaptureApp')
  .controller('AddUrlDialogController', function ($scope, $mdDialog, $http, $mdToast) {

  $scope.close = function() {
    $mdDialog.hide();
  };

  $scope.addUrl = function( url, urlIsAutomaticSource ) {
    if( url ) {
      $http({
        method:    'POST',
        url:       '/api/url',
        headers:   { 'Content-Type': 'application/json' },
        data:      {
          url: url,
          urlIsAutomaticSource: urlIsAutomaticSource
        },
      }).then(function(response) {
        $scope.close();

        $mdToast.show(
          $mdToast.simple({ position:'bottom right' })
            .textContent( 'URL added successfully!' )
            .hideDelay( 2000 )
        );
      }).catch(function(err) {
        $scope.applyingSettings = false;
        $mdToast.show(
          $mdToast.simple({ position:'bottom right' })
            .textContent( 'Unable to add URL: HTTP ' + err.statusText + ": " + err.data )
            .hideDelay( 7000 )
        );
      });
    }
  }

});
