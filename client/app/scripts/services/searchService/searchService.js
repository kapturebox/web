'use strict';

angular.module('kaptureApp')
  .service('searchService', function( $http, popup ) {
    var SEARCH_URI = '/api/search';

    var state = {
      loading:  false,
      query:    null,
      results:  []
    };

    this.isLoading = function() {
      return state.loading;
    };

    this.getResults = function() {
      return state.results;
    };

    this.search = function( query ) {
      state.loading  = true;
      state.results  = null;
      state.query    = query;

      $http({
        url: SEARCH_URI,
        method: 'GET',
        params: {
          q: query
        }
      }).then( function( results ) {
        state.loading = false;
        state.results = results.data;
        return state.results;
      }, function( failed ) {
        state.loading = false;
        popup.error( 'Query failed: ' + failed.status + ' ' + failed.statusText );        
      });
    };


    return this;
  });
