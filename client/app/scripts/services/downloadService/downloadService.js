'use strict';

angular.module('kaptureApp')
  .service('downloadService', function ($http, $interval, $log) {
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

        popup.info( 'got ' + stateData.downloads.length + ' entries' );

        return stateData.downloads;
      }).catch(function(err){
        popup.error( 'Error fetching: ' + angular.toJson( err ) );
      });
    }


    // REFACTOR INTO TOASTR SERVICE
    toastr.options = {
      progressBar: true,
      hideDuration: 300,
      showEasing: 'swing',
      positionClass: 'toast-bottom-right'
    };

    var popup = {
      success: function( msg ) {
        toastr.success( msg );
        $log.info( '[downloadService]: ' + msg );
      },
      info: function( msg ) {
        toastr.info( msg );
        $log.info( '[downloadService]: ' + msg );
      },
      error: function( msg ) {
        toastr.error( msg );
        $log.error( '[downloadService]: ' +  msg );
      }
    }

    // EXPOSED FUNCTIONS
    // start / stop intervals
    this.stopFetching = function() {
      $interval.cancel( stateData.interval );
    }

    this.startFetching = function() {
      stateData.interval = $interval( fetch, 3000 ); // 3s
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
        popup.info( 'successfully removed item: ' + item.title );
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
        return popup.info( 'Download started..' );
      }, function( failed ) {
        return popup.error( 'Can\'t add: ' + failed.status + ' ' + failed.statusText );
      });
    }

    // init
    this.startFetching();

    // Public API here
    return this;
  });
