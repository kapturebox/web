'use strict';
/**
 * @ngdoc function
 * @name kaptureApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the kaptureApp
 */
angular.module('kaptureApp')
  .controller('MainCtrl', function($scope,downloadService) {

    $scope.downloads = downloadService.getCurrentDownloads;

  });
