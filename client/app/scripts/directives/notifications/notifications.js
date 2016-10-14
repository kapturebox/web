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
    	}
	});


