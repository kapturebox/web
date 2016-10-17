'use strict';
/**
 * @ngdoc function
 * @name kaptureApp.controller:AutokaptureCtrl
 * @description
 * # AutokaptureCtrl
 * Controller of the Autokapture page
 */
angular.module('kaptureApp')
  .controller('AutokaptureCtrl', ['$scope','seriesService','downloadService', function( $scope, seriesService, downloadService ) {

    $scope.isLoading      = seriesService.isLoading;
    $scope.delete         = downloadService.delete;
    $scope.accordionState = [];

    $scope.$watch('accordionState', function(newval, oldval) {
      var index = $scope.accordionState.indexOf( true );

      // if something is selected and that something doesnt have eps
      if( index !== -1 && seriesService.series[index].recent === undefined ) {
        return seriesService.getRecentEpsidoes( seriesService.series[index] );
      }
      
      return ;
    }, true);


    // need seriesService to be in scope in order to watch it
    $scope.seriesService = seriesService;
    $scope.$watch('seriesService.series', function() {
      $scope.series = seriesService.series;
    });

    seriesService.fetch();

	}]);
