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
			scope: {
				downloads: '=downloads'
			},
			templateUrl:'app/scripts/directives/header/header-notification/header-notification.html',
			restrict: 'E',
			replace: true,
			link: function(scope, element, attrs) {
				scope.$watch('downloads', function( downloads, key ) {
					console.log('inDirective:', downloads );
				})
			}
    	}
	});


