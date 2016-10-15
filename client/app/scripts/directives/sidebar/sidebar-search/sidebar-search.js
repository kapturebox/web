'use strict';

/**
 * @ngdoc directive
 * @name izzyposWebApp.directive:adminPosHeader
 * @description
 * # adminPosHeader
 */

angular.module('kaptureApp')
  .directive('sidebarSearch',function() {
    return {
      templateUrl:'app/scripts/directives/sidebar/sidebar-search/sidebar-search.html',
      restrict: 'E',
      replace: true,
      scope: {
      },
      controller:function($scope, $state){
        $scope.selectedMenu = 'home';
        $scope.doSearch = function() {
          $state.go('search', {query: $scope.query});
        }
      }
    }
  });
