'use strict';

angular.module('kaptureApp')
  .controller('AutoKaptureCtrl', function ($scope, $http) {

    $scope.downloadSources = [
      {type: 'rss', name: 'All showrss feeds', url: 'http://showrss.info/feeds/all.rss'},
      {type: 'rss', name: 'gaieges showrss feeds', url: 'http://showrss.info/rss.php?user_id=13749&hd=1&proper=1&'},
    ];

    $scope.deleteSource = function( s ) {
      $scope.downloadSources.splice($scope.downloadSources.indexOf(s),1);
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
