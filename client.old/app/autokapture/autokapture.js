'use strict';

angular.module('kaptureApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('autokapture', {
        url: '/autokapture',
        templateUrl: 'app/autokapture/autokapture.html',
        controller: 'AutoKaptureCtrl'
      });
  });
