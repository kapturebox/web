'use strict';
/**
 * @ngdoc function
 * @name kaptureApp.controller:WatchCtrl
 * @description
 * # WatchCtrl
 * Controller of the watch page
 */
angular.module('kaptureApp')
  .controller('WatchCtrl', ['$scope','$stateParams','$sce', function( $scope, $stateParams, $sce ) {
    var watchUrl = location.protocol + '//' + location.hostname  + ':32400/web/';
    $scope.watchiFrameUrl = $sce.trustAsResourceUrl( watchUrl );
	}]);
