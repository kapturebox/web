'use strict';

angular.module('kaptureApp')
  .controller('GetCtrl', function ($scope) {
    $scope.addUrl = function( url ) {
      console.log( url );
    };

    $scope.downloadSources = [
      {type: 'rss', name: 'All showrss feeds', url: 'http://showrss.info/feeds/all.rss'},
      {type: 'rss', name: 'gaieges showrss feeds', url: 'http://showrss.info/rss.php?user_id=13749&hd=1&proper=1&'},
    ];

    $scope.addRssFeed = function( feed ) {
      $scope.downloadSources.push({
        type: 'rss',
        name: 'newly added src',
        url: feed
      });

      $scope.rssSourceFormIsOpen = false;
    };

    $scope.deleteSource = function( ev ) {
      console.log(ev);
    };

  });
