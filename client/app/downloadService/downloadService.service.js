'use strict';

angular.module('kaptureApp')
  .factory('downloadService', function ($http, $interval, $mdToast) {

    //always use objects as top level... referenceable
    var stateData = {
      downloads: [],
      series: [],
      interval: null, //stop later?
      running: false,
      // getDownloads:
    };

    this.state = stateData;
    this.handleDownloadData = handleDownloadData;
    this.getCurrentDownloads = getCurrentDownloads;
    this.remove = removeDownload;
    this.addDownload = addDownload;
    this.getCurrentSeries = getCurrentSeries;
    this.getSeries = getSeries;

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

    function getCurrentSeries(){
      console.log('getting series');
      return stateData.series;
    }

    //usually good to just throw in an intermediary
    //additional parsing... etc
    function handleDownloadData(data){
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


    function getSeries() {
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

    function getSeriesUpcomingEpisodes( item ) {
      if( ! item.showRssId ) {
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



    function removeDownload( item ) {
      return $http({
        method: 'DELETE',
        url: '/api/download/' + item.hashString,
        timeout: 30000 //ms
      }).then(function( resp ) {
        return resp.data;
      }).catch(function( err ) {
        console.log( 'error: ', err );
      });
    };



    function addDownload( obj ) {
      var endpoint = '/api/download';
      var successMessage = 'Download started..';

      if( obj.mediaType == 'series' ) {
        endpoint = '/api/series';
        successMessage = 'Series added!';
      }

      return $http({
        url:    endpoint,
        method: 'PUT',
        data:   {
          item: obj
        }
      }).then( function( resp ) {
        return showToastMessage( successMessage );
      }, function( failed ) {
        return showToastMessage( 'Can\'t add: ' + failed.status + ' ' + failed.statusText );
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
