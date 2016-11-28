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
      controller: function( $scope, $filter, downloadService, notificationService ) {
        $scope.$on('downloads.updated', function() {
          $scope.downloads     = downloadService.getActiveDownloads();
          $scope.notifications = notificationService.getNotifications();
        });

      }
    }
  });


