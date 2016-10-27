'use strict';

angular.module('kaptureApp')
  .factory('downloadService', function( $http, $interval, $filter, $rootScope, popup ) {
    var DOWNLOAD_URI = '/api/download';

    // singleton to be returned to callers
    var svc = {};
    
    // current state of world (private)
    var downloads  = [];
    var running    = false;
    var interval   = null;

    // private functions
    svc.fetch = function() {
      if( running ) return;
      running = true;

      return $http({
        method:  'GET',
        url:     DOWNLOAD_URI,
        timeout: 30 * 1000,  //ms
        ignoreLoadingBar: true
      }).then(function( resp ) {
        if( resp.status === 200 ) { // only update array and broadcast if modified
          downloads = $filter('orderBy')( resp.data, ['!isFinished','startDate'], true );
          running = false;

          $rootScope.$broadcast( 'downloads.updated' );
        }

        return downloads;
      }).catch(function(err){
        popup.error( 'Error fetching: ' + angular.toJson( err ) );
      });
    }


    // EXPOSED FUNCTIONS
    // start / stop intervals
    svc.stopFetching = function() {
      $interval.cancel( interval );
    }

    svc.startFetching = function( delay ) {
      interval = $interval( svc.fetch, delay || 3000 ); // 3s
    }

    svc.updateFetchDelay = function( delay ) {
      svc.stopFetching();
      svc.startFetching( delay );
    }

    svc.getDownloads = function() {
      return downloads;
    }

    svc.isLoading = function() {
      return running;
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
        popup.success( 'successfully removed: ' + item.title );
        return resp.data;
      }).catch(function( err ) {
        popup.error( 'error: ' + err.data.error  );
      });
    };

    // removes download and deletes from disk
    svc.delete = function( item ) {
      return svc.remove( item, true );
    }

    // sends item to download service to start
    svc.add = function( item ) {
      var data = {item: item};

      if( item && item.url ) {
        data = {item:{
          url: item.url,
          downloadMechanism: 'url'
        }};
      }

      return $http({
        url:     DOWNLOAD_URI,
        method:  'PUT',
        data:    data
      }).then( function( resp ) {
        var msg = 'Download started..';

        if( item.mediaType === 'series' ) {
          msg = 'Series added to AutoKapture';
        }

        return popup.success( msg );
      }, function( err ) {
        return popup.error( 'Can\'t add: ' + err.data.error );
      });
    }

    // keep it simple for now and just look for '://' since we want to handle all sorts of protocols
    svc.isUrl = function( str ) {
      return /\:\/\//.test( str );
    }

    // init
    svc.startFetching();

    // Public API here
    return svc;
  });
