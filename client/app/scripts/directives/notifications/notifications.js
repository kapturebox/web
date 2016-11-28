'use strict';

/**
 * @ngdoc directive
 * @name izzyposWebApp.directive:adminPosHeader
 * @description
 * # adminPosHeader
 */
angular.module('kaptureApp')
  .directive('notifications',function(){
    return {
      templateUrl:'app/scripts/directives/notifications/notifications.html',
      restrict: 'E',
      replace: true,
      controller: function( $scope, $filter, notificationService ) {
        $scope.notifications = notificationService.getNotifications();

        $scope.$on('downloads.updated', function() {
          $scope.notifications = notificationService.getNotifications();
        });

        $scope.parseDate = function( d ) {
          return new Date( d );
        };
      }
  	}
});


