'use strict';
/**
 * @ngdoc function
 * @name kaptureApp.controller:DownloadCtrl
 * @description
 * # DownloadCtrl
 * Controller of the download page
 */
angular.module('kaptureApp')
  .controller('DownloadCtrl', ['$scope', 'downloadService', function( $scope, downloadService ) {

    $scope.downloads = downloadService.getDownloads;
    $scope.isLoading = downloadService.isLoading;
    $scope.remove    = downloadService.remove;
    $scope.delete    = downloadService.delete;

    $scope.watch     = function( item ) {
      // nothing for now
    }

    // kickstart the process
    downloadService.fetch();

	}]);
