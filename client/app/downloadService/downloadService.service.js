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

    init();

    // Public API here
    return this;

    function init(){
      if (!stateData.interval){
        stateData.interval = $interval(getDownloads, 3000); // just runs in another 30s...
      }
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
  });
