'use strict';

angular.module('kaptureApp')
  .directive('kpFiletypeIcon', function () {
    return {
      templateUrl: 'app/kp-filetype-icon/kp-filetype-icon.html',
      restrict: 'EA',
      scope: {
        mediaType: '@'
      },
      link: function (scope, element, attrs) {
      }
    };
  });
