'use strict';

angular.module('kaptureApp')
  .factory('downloadService', function ($http, $interval, $mdToast) {

    //always use objects as top level... referenceable
    var stateData = {
      downloads: [],
      series: [],
      interval: null, //stop later?
      running: false,
    };

    this.getCurrentDownloads = getCurrentDownloads;
    this.getEnabledSeries    = getEnabledSeries;
    this.deleteSeries        = deleteSeries;

    this.removeActive = removeActive;
    this.deleteActive = deleteActive;
    this.addDownload  = addDownload;

    this.pullSeries                 = pullSeries;
    this.pullSeriesUpcomingEpisodes = pullSeriesUpcomingEpisodes;

    init();

    // Public API here
    return this;

    function init(){
      if (!stateData.interval){
        stateData.interval = $interval(getDownloads, 3000); // just runs in another 30s...
      }
      getDownloads();
    }

    function getCurrentDownloads(){
      return stateData.downloads;
    }

    function getEnabledSeries(){
      return stateData.series;
    }

    //usually good to just throw in an intermediary
    //additional parsing... etc
    function handleDownloadData( data ){
      stateData.downloads = data;
      return data;
    }

    function getDownloads() {
      if (stateData.running) return;
      stateData.running = true;
      return $http({
        method: 'GET',
        url: '/api/download',
        timeout: 30000  // in ms
      }).then( function( resp ) {
        handleDownloadData(resp.data); // keep data locally
        stateData.running = false;
        return stateData.downloads;
      });
    }


    function pullSeries() {
      if (stateData.gettingSeries) return;
      stateData.gettingSeries = true;
      return $http({
        method: 'GET',
        url: '/api/series',
        timeout: 30000  // in ms
      }).then( function( resp ) {
        stateData.series = resp.data.series;
        stateData.gettingSeries = false;
        return stateData.series;
      });
    }


    function pullSeriesUpcomingEpisodes( item ) {
      if( ! item || ! item.showRssId ) {
        return {};
      }

      return $http({
        method: 'GET',
        url: '/api/series/' + item.showRssId,
        timeout: 30000  // in ms
      }).then( function( resp ) {
        return resp.data;
      });
    }



    function removeActive( item, deleteFile ) {
      var permDelete = false;
      if( deleteFile ){
        permDelete = true;
      }

      return $http({
        method: 'DELETE',
        url: '/api/download/' + item.hashString,
        data: {
          delete: permDelete,
        },
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 30000 //ms
      }).then(function( resp ) {
        return resp.data;
      }).catch(function( err ) {
        console.log( 'error: ', err );
      });
    };

    function deleteActive( item ) {
      return removeActive( item, true );
    }



    function addDownload( item ) {
      var endpoint = '/api/download';
      var successMessage = 'Download started..';

      if( item.mediaType == 'series' ) {
        endpoint = '/api/series';
        successMessage = 'Series added!';
      }

      return $http({
        url:    endpoint,
        method: 'PUT',
        data:   {
          item: item
        }
      }).then( function( resp ) {
        return showToastMessage( successMessage );
      }, function( failed ) {
        return showToastMessage( 'Can\'t add: ' + failed.status + ' ' + failed.statusText );
      });
    }

    function deleteSeries( item ) {
      return $http({
        method: 'DELETE',
        url: '/api/series/' + item.showRssId
      }).then( function( resp ) {
        console.log(resp);
        return resp;
      });
    }


    function showToastMessage( msg ) {
      return $mdToast.show(
        $mdToast.simple()
          .textContent( msg )
          .hideDelay( 2000 )
      );
    }
  });
