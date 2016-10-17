'use strict';

angular.module('kaptureApp')
  .factory('downloadService', function( $http, $interval, $filter, $rootScope, popup ) {
    var DOWNLOAD_URI = '/api/download';

    var svc = {};
    
    // current state of world
    svc.downloads  = [];
    svc.running    = false;
    svc.interval   = null;

    // private functions
    svc.fetch = function() {
      if( svc.running ) return;
      svc.running = true;

      return $http({
        method:  'GET',
        url:     DOWNLOAD_URI,
        timeout: 30 * 1000,  //ms
        ignoreLoadingBar: true
      }).then(function( resp ) {
        if( resp.status === 200 ) { // only update array and broadcast if modified
          svc.downloads = $filter('orderBy')( resp.data, ['!isFinished','startDate'], true );
          svc.running = false;

          $rootScope.$broadcast( 'downloads.updated' );
        }

        return svc.downloads;
      }).catch(function(err){
        popup.error( 'Error fetching: ' + angular.toJson( err ) );
      });
    }


    // EXPOSED FUNCTIONS
    // start / stop intervals
    svc.stopFetching = function() {
      $interval.cancel( svc.interval );
    }

    svc.startFetching = function( delay ) {
      svc.interval = $interval( svc.fetch, delay || 3000 ); // 3s
    }

    svc.updateFetchDelay = function( delay ) {
      svc.stopFetching();
      svc.startFetching( delay );
    }

    // removes the selected download from backend
    // by default, won't delete file on disk (just from lists)
    svc.remove = function( item, deleteFileOnDisk ) {
      return $http({
        method:  'DELETE',
        url:     DOWNLOAD_URI,
        timeout: 30 * 1000, //ms
        headers: {
          'Content-Type': 'application/json'
        },
        data: {
          item:              item,
          deleteFileOnDisk:  deleteFileOnDisk || false,
        }
      }).then(function( resp ) {
        popup.success( 'successfully removed item: ' + item.title );
        return resp.data;
      }).catch(function( err ) {
        popup.error( 'error', err );
      });
    };

    // removes download and deletes from disk
    svc.delete = function( item ) {
      return svc.removeActive( item, true );
    }

    // sends item to download service to start
    svc.add = function( item ) {
      return $http({
        url:     DOWNLOAD_URI,
        method:  'PUT',
        data:    {
          item: item
        }
      }).then( function( resp ) {
        return popup.success( 'Download started..' );
      }, function( failed ) {
        return popup.error( 'Can\'t add: ' + failed.status + ' ' + failed.statusText );
      });
    }

    // init
    svc.startFetching();

    // Public API here
    return svc;
  });
