'use strict';

angular.module('kaptureApp')
  .factory('downloadService', function ($http, $interval) {

    //always use objects as top level... referenceable
    var stateData = {
      downloads: [],
      interval: null, //stop later?
      running: false
      // getDownloads:
    };

    this.state = stateData;
    this.handleDownloadData = handleDownloadData;
    this.getCurrentDownloads = getCurrentDownloads;
    this.remove = removeDownload;

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

  });
