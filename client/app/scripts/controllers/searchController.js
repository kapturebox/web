'use strict';
/**
 * @ngdoc function
 * @name kaptureApp.controller:SearchCtrl
 * @description
 * # SearchCtrl
 * Controller of the search page
 */
angular.module('kaptureApp')
  .controller('SearchCtrl', ['$scope','$stateParams','searchService', 'downloadService', '$rootScope', function( $scope, $stateParams, searchService, downloadService, $rootScope ) {
		$scope.query      = $stateParams.query;
    $scope.results    = searchService.getResults;
    $scope.isLoading  = searchService.isLoading;

    $scope.download   = downloadService.add;

    searchService.search( $stateParams.query );

    $scope.$on( '$destroy', function() {
      $rootScope.$broadcast( 'clearSearchInput' );
    });

	}]);
