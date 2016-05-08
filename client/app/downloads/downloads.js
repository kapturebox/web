'use strict';

angular.module('kaptureApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('downloads', {
        url: '/downloads',
        templateUrl: 'app/downloads/downloads.html',
        controller: 'DownloadsCtrl'
      });
  });
