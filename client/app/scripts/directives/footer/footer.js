'use strict';

/**
 * @ngdoc directive
 * @name izzyposWebApp.directive:adminPosfooter
 * @description
 * # adminPosfooter
 */
angular.module('kaptureApp')
	.directive( 'footer',function() {
		return {
			templateUrl:'app/scripts/directives/footer/footer.html',
			restrict: 'E',
			scope: {},
			replace: true
    };
	});


