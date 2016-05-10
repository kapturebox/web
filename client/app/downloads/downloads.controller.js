'use strict';

angular.module('kaptureApp')
  .controller('DownloadsCtrl', function ($scope, $http, $interval, $location, downloadService) {

    $scope.getDownloads = downloadService.getCurrentDownloads;

  });
