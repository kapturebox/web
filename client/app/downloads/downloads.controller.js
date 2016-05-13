'use strict';

angular.module('kaptureApp')
  .controller('DownloadsCtrl', function ($scope, downloadService) {
    $scope.getDownloads = downloadService.getCurrentDownloads;
    $scope.remove = downloadService.remove;
  });
