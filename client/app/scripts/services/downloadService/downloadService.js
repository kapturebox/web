'use strict';

angular.module('kaptureApp')
  .service('downloadService', function( $http, $interval, popup ) {
    var DOWNLOAD_URI = '/api/download';

    var self = this;
    // current state of world
    var stateData = {
      downloads: [],
      interval: null,
      running: false,
    };

    // private functions
    function fetch() {
      if (stateData.running) return;
      stateData.running = true;

      return $http({
        method:  'GET',
        url:     DOWNLOAD_URI,
        timeout: 30 * 1000  //ms
      }).then(function( resp ) {
        stateData.downloads = resp.data;
        stateData.running = false;

        popup.success( 'got ' + stateData.downloads.length + ' active download entries' );

        return stateData.downloads;
      }).catch(function(err){
        popup.error( 'Error fetching: ' + angular.toJson( err ) );
      });
    }


    // EXPOSED FUNCTIONS
    // start / stop intervals
    this.stopFetching = function() {
      $interval.cancel( stateData.interval );
    }

    this.startFetching = function( delay ) {
      stateData.interval = $interval( fetch, delay || 3000 ); // 3s
    }

    this.updateFetchDelay = function( delay ) {
      self.stopFetching();
      self.startFetching( delay );
    }
    
    // return the current active downloads
    this.list = function() {
      return stateData.downloads;
    }

    // removes the selected download from backend
    // by default, won't delete file on disk (just from lists)
    this.remove = function( item, deleteFileOnDisk ) {
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
    this.delete = function( item ) {
      return self.removeActive( item, true );
    }

    // sends item to download service to start
    this.add = function( item ) {
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
    this.startFetching();

    // Public API here
    return this;
  });
