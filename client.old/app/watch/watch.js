'use strict';

angular.module('kaptureApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('watch', {
        url: '/watch',
        templateUrl: 'app/watch/watch.html',
        controller: 'WatchCtrl'
      });
  });