'use strict';

angular.module('kaptureApp')
  .controller('GetCtrl', function ( $scope, $mdToast, $http, downloadService ) {

    $scope.unescape = unescape;
    $scope.selectOrder = '-score';

    $scope.selected = [];

    $scope.getDate = function(arg) {
      return moment(new Date(arg));
    }

    $scope.mediaSearch = function() {
      $scope.searchResults = null;
      $scope.searchLoading = true;

      $http({
        url: '/api/search',
        method: 'GET',
        params: {
          q: $scope.searchText
        }
      }).then( function( results ) {
        $scope.searchLoading = false;
        $scope.searchResults = results.data;
      }, function( failed ) {
        $scope.searchLoading = false;
        $mdToast.show(
          $mdToast.simple({ position:'bottom right' })
            .textContent( 'Query failed: ' + failed.status + ' ' + failed.statusText )
            .hideDelay( 2000 )
        );
      });
    }

    $scope.downloadLink = downloadService.addDownload;

  });
