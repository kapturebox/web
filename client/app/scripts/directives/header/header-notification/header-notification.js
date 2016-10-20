'use strict';

/**
 * @ngdoc directive
 * @name izzyposWebApp.directive:adminPosHeader
 * @description
 * # adminPosHeader
 */
angular.module('kaptureApp')
  .directive('headerNotification',function(){
    return {
      templateUrl:'app/scripts/directives/header/header-notification/header-notification.html',
      restrict: 'E',
      replace: true,
      controller: function($scope, downloadService) {

        $scope.downloads = downloadService.getDownloads();

        $scope.$on('downloads.updated', function() {
          $scope.downloads = downloadService.getDownloads();
        })
      }
    }
  });


