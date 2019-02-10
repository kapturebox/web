'use strict';

angular.module('kaptureApp')
  .factory('seriesService', function( $http, $filter, configurator ) {
    var SERIES_URI = `${configurator.SERVER_ENDPOINT}/api/series`;

    // current state of world
    var svc = {
      series:    [],
      interval:  null,
      isLoading: false
    };

    svc.fetch = function() {
      if( svc.isLoading ) return;
      svc.isLoading = true;

      return $http({
        method:   'GET',
        url:      SERIES_URI,
        timeout:  30 * 1000  // 30s
      }).then( function( resp ) {
        svc.series = $filter('orderBy')( resp.data, ['title'] );
        svc.isLoading = false;

        return svc.series;
      });
    };

    svc.getEnabledSeries = function() {
      return svc.series;
    };


    svc.getRecentEpsidoes = function( item ) {
      if( ! item || ! item.id ) {
        return {};
      }

      var url = '/api/series/source/'+item.sourceId+'/series/'+item.id;

      return $http({
        method:   'GET',
        url:      url,
        timeout:  30 * 1000  // 30s
      }).then( function( resp ) {
        svc.series[ svc.series.indexOf( item ) ].recent = resp.data;
        return resp.data;
      });
    };


    // Public API here
    return svc;
  });
