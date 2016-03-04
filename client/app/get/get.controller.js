'use strict';

angular.module('kaptureApp')
  .controller('GetCtrl', function ( $scope, $mdDialog, $mdMedia, $http ) {
    $scope.deleteSource = function( ev ) {
      console.log( 'in delete source' );
      console.log( ev );
    };

    $scope.downloadSources = [
      {type: 'rss', name: 'All showrss feeds', url: 'http://showrss.info/feeds/all.rss'},
      {type: 'rss', name: 'gaieges showrss feeds', url: 'http://showrss.info/rss.php?user_id=13749&hd=1&proper=1&'},
    ];

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
  });
