'use strict';
/**
 * @ngdoc function
 * @name kaptureApp.controller:SearchCtrl
 * @description
 * # SearchCtrl
 * Controller of the search page
 */
angular.module('kaptureApp')
  .controller('SearchCtrl', ['$scope','$stateParams','searchService', function( $scope, $stateParams, searchService ) {
		$scope.query      = $stateParams.query;
    $scope.results    = searchService.getResults;
    $scope.isLoading  = searchService.isLoading;

    searchService.search( $stateParams.query );

	}]);
