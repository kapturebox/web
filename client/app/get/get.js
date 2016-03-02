'use strict';

angular.module('kaptureApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('get', {
        url: '/get',
        templateUrl: 'app/get/get.html',
        controller: 'GetCtrl'
      });
  });