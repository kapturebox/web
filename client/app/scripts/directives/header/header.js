'use strict';

/**
 * @ngdoc directive
 * @name izzyposWebApp.directive:adminPosHeader
 * @description
 * # adminPosHeader
 */
angular.module('kaptureApp')
	.directive( 'header',function() {
		return {
			templateUrl:'app/scripts/directives/header/header.html',
			restrict: 'E',
			scope: {},
			replace: true,
			controller: function( $scope, $state, downloadService ) {
        $scope.doSearch = function() {
					if ( downloadService.isUrl( $scope.query ) ) {
						return downloadService.add( {url: $scope.query} );
					};

          $state.go( 'nav.search', {query: $scope.query} );
        };

				$scope.$on( 'clearSearchInput', function() {
					$scope.query = null;
				});

			}
		}
	});


