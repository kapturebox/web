'use strict';

/**
 * @ngdoc directive
 * @name izzyposWebApp.directive:adminPosmediaIcon
 * @description
 * # adminPosmediaIcon
 */
angular.module('kaptureApp')
	.directive( 'mediaIcon',function() {
		return {
			templateUrl:'app/scripts/directives/media-icon/media-icon.html',
			restrict: 'E',
			scope: {
				type: '@'
			},
			replace: true
    };
	});


