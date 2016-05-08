'use strict';

angular.module('kaptureApp')
  .controller('GetCtrl', function ( $scope, $mdToast, $http ) {

    $scope.unescape = unescape;

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
          $mdToast.simple()
            .textContent( 'Query failed: ' + failed.status + ' ' + failed.statusText )
            .hideDelay( 2000 )
        );
      });
    }

    $scope.downloadLink = function( obj ) {
      $http({
        url:    '/api/download',
        method: 'PUT',
        data:   {
          item: obj
        }
      }).then( function( resp ) {
        $mdToast.show(
          $mdToast.simple()
            .textContent( 'Download started' )
            .hideDelay( 2000 )
        );
      }, function( failed ) {
        $mdToast.show(
          $mdToast.simple()
            .textContent( 'Download failed: ' + failed.status + ' ' + failed.statusText )
            .hideDelay( 2000 )
        );
      });
    }

  });
