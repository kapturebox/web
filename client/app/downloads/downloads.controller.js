'use strict';

angular.module('kaptureApp')
  .controller('DownloadsCtrl', function ($scope, $http, $interval, $location, downloadService, stateDownloads) {
    $scope.getDownloads = downloadService.getCurrentDownloads;
    $scope.remove = downloadService.remove;
  });
