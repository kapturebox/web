'use strict';

angular.module('kaptureApp')
  .controller('AutoKaptureCtrl', function ($scope, $http, downloadService) {

    downloadService.getSeries();

    $scope.getCurrentSeries = downloadService.getCurrentSeries;

    $scope.getSeriesUpcomingEpisodes = downloadService.getSeriesUpcomingEpisodes;


    // $scope.deleteSource = function( s ) {
    //   $scope.downloadSources.splice($scope.downloadSources.indexOf(s),1);
    // };
    //
    // $scope.getSourceEntries = function( url ) {
    //   $http({
    //     method: 'GET',
    //     url:    '/api/sources/list-entries',
    //     params:  { url: url }
    //   })
    //   .then(function(results){
    //     $scope.sourceEntries = results.data.items;
    //   });
    // }
    //
    $scope.selectSourceItem = function( index, item ) {
      if( $scope.selectedSourceIndex === index ) {
        $scope.selectedSourceIndex = undefined;
      } else {
        $scope.selectedSourceIndex = index;
      }
    }
    //
    // $scope.parseDate = function( date ) {
    //   return new Date(date);
    // };


  });
