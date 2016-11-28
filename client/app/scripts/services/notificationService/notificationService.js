'use strict';

angular.module('kaptureApp')
  .factory('notificationService', function( $rootScope, downloadService, $filter ) {
    // for now we just pull from downoad service, and filter it.

    var svc = {
      notifications: []
    };

    $rootScope.$on( 'downloads.updated', function( event, data ) {
      svc.notifications = $filter( 'filter' )( data, {isFinished: true} ) 
    });

    svc.getNotifications = function() {
      return svc.notifications;
    }

    // Public API here
    return svc;
  });
