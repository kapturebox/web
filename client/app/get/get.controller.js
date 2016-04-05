'use strict';

angular.module('kaptureApp')
  .controller('GetCtrl', function ( $scope, $mdDialog, $mdToast, $mdMedia, $http, $timeout ) {
    /////////////////////////
    // Automated sources tab
    /////////////////////////

    $scope.downloadSources = [
      {type: 'rss', name: 'All showrss feeds', url: 'http://showrss.info/feeds/all.rss'},
      {type: 'rss', name: 'gaieges showrss feeds', url: 'http://showrss.info/rss.php?user_id=13749&hd=1&proper=1&'},
    ];

    $scope.deleteSource = function( s ) {
      console.log( 'in delete source' );
      console.log( s );
      $scope.downloadSources.splice($scope.downloadSources.indexOf(s),1);
    };

    $scope.showAddUrlDialog = function(ev) {
      var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;
      $mdDialog.show({
        controller: 'AddUrlDialogController',
        templateUrl: 'components/addurl/addurl.dialog.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose: true,
        fullscreen: useFullScreen
      })
    };

    $scope.getSourceEntries = function( url ) {
      $http({
        method: 'GET',
        url:    '/api/sources/list-entries',
        params:  { url: url }
      })
      .then(function(results){
        $scope.sourceEntries = results.data.items;
      });
    }

    $scope.selectSourceItem = function( index, item ) {
      if( $scope.selectedSourceIndex === index ) {
        $scope.selectedSourceIndex = undefined;
      } else {
        $scope.selectedSourceIndex = index;
        $scope.sourceEntries = $scope.getSourceEntries(item.url);
      }
    }

    $scope.parseDate = function( date ) {
      return new Date(date);
    };




    ///////////////////
    // Downloads tab
    ///////////////////

    (function getDownloads() {
      $http({
        method: 'GET',
        url: '/api/download',
        timeout: 30000  // in ms
      }).then( function( resp ) {
        $scope.downloads = resp.data;
      }).finally( function() {
        $timeout( getDownloads, 3000 );
      })
    })();








    ///////////////////
    // Search tab
    ///////////////////

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
