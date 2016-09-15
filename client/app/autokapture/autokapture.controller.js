'use strict';

angular.module('kaptureApp')
  .controller('AutoKaptureCtrl', function ($scope, $http, downloadService) {

    $scope.selectedSeriesIndex = undefined;

    downloadService.pullSeries();

    $scope.getEnabledSeries = downloadService.getEnabledSeries;

    $scope.deleteSeries = function( item ) {
      downloadService.deleteSeries( item )
        .then(function( resp ) {
          downloadService.pullSeries();
        });
    };

    $scope.selectSeries = function( index, item ) {
      if( $scope.selectedSeriesIndex === index ) {
        $scope.selectedSeriesIndex = undefined;
      } else {
        $scope.selectedSeriesEpisodes = [];
        $scope.selectedSeriesIndex = index;

        downloadService.pullSeriesUpcomingEpisodes( item )
          .then(function(data) {
            $scope.selectedSeriesEpisodes = data;
          });
      }
    }

    $scope.parseDate = function( date ) {
      return new Date(date);
    };

  });
