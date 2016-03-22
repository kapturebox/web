'use strict';

angular.module('kaptureApp')
  .controller('GetCtrl', function ( $scope, $mdDialog, $mdMedia, $http, $timeout ) {
    /////////////////////////
    // Automated sources tab
    /////////////////////////

    $scope.downloadSources = [
      {type: 'rss', name: 'All showrss feeds', url: 'http://showrss.info/feeds/all.rss'},
      {type: 'rss', name: 'gaieges showrss feeds', url: 'http://showrss.info/rss.php?user_id=13749&hd=1&proper=1&'},
    ];

    $scope.deleteSource = function( s ) {
      console.log( 'in delete source' );
      console.log( s );
      $scope.downloadSources.splice($scope.downloadSources.indexOf(s),1);
    };

    $scope.showAddUrlDialog = function(ev) {
      var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;
      $mdDialog.show({
        controller: 'AddUrlDialogController',
        templateUrl: 'components/addurl/addurl.dialog.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose: true,
        fullscreen: useFullScreen
      })
    };

    $scope.getSourceEntries = function( url ) {
      $http({
        method: 'GET',
        url:    '/api/sources/list-entries',
        params:  { url: url }
      })
      .then(function(results){
        $scope.sourceEntries = results.data.items;
      });
    }

    $scope.selectSourceItem = function( index, item ) {
      if( $scope.selectedSourceIndex === index ) {
        $scope.selectedSourceIndex = undefined;
      } else {
        $scope.selectedSourceIndex = index;
        $scope.sourceEntries = $scope.getSourceEntries(item.url);
      }
    }

    $scope.parseDate = function( date ) {
      return new Date(date);
    };




    ///////////////////
    // Downloads tab
    ///////////////////
    //
    // $timeout(
    //   $http({
    //     method: 'GET',
    //     url: '/api/downloads'
    //   }).then(function( results ) {
    //     $scope.downloads = results;
    //   }), 2000);
    //

    $scope.downloads = [
      {status: 'active', name: 'Workaholics', progress: '50'},
      {status: 'active', name: 'Always sunny', progress: '10'},
      {status: 'complete', name: 'South Park', progress: '100'},
    ]








    ///////////////////
    // Search tab
    ///////////////////

    $scope.tempSearchResults = [
      {source: 'showrss', title: 'Always Sunny in Philledelphia', uploaded: Date.now(), mediaType: 'video', series: true},
      {source: 'piratebay', title: 'South Park', uploaded: Date.now(), mediaType: 'video', size: 1203767178},
      {source: 'kickass', title: 'Family guy', mediaType: 'video', category: 'Comedy'},
      {source: 'kickass', title: 'Jay-Z Black Album', uploaded: new Date('2014-09-20Z12:31:10+0000'), mediaType: 'audio'},
      {title: 'Puff Daddy - No Way Out', uploaded: new Date('2014-09-20Z12:31:10+0000'), mediaType: 'audio'},
    ];

    $scope.mediaSearch = function() {
      delete $scope.searchResults;
      $scope.searchLoading = true;
      $timeout( function() {
        $scope.searchLoading = false;
        $scope.searchResults = $scope.tempSearchResults;
      }, 2000);
    }

  });
