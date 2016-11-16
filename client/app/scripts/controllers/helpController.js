'use strict';
/**
 * @ngdoc function
 * @name kaptureApp.controller:HelpCtrl
 * @description
 * # HelpCtrl
 * Controller of the help page
 */
angular.module('kaptureApp')
  .controller('HelpCtrl', ['$scope','$http', function( $scope, $http ) {
    $http.get('/assets/misc/HELP.md').then(function(resp){
      $scope.mdText = resp.data;
    })
	}]);
