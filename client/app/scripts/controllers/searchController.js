'use strict';
/**
 * @ngdoc function
 * @name kaptureApp.controller:SearchCtrl
 * @description
 * # SearchCtrl
 * Controller of the search page
 */
angular.module('kaptureApp')
  .controller('SearchCtrl', ['$scope','$stateParams','searchService', 'downloadService', function( $scope, $stateParams, searchService, downloadService ) {
		$scope.query      = $stateParams.query;
    $scope.results    = searchService.getResults;
    $scope.isLoading  = searchService.isLoading;

    $scope.download   = downloadService.add;

    searchService.search( $stateParams.query );

	}]);
