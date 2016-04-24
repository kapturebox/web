'use strict';

angular.module('kaptureApp')
  .controller('WatchCtrl', function ($scope, $sce) {
    var watchUrl = location.protocol + '//' + location.hostname  + ':32400/web/';
    $scope.watchiFrameUrl = $sce.trustAsResourceUrl( watchUrl );
  });
