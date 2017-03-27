'use strict';
/**
 * @ngdoc function
 * @name kaptureApp.controller:SearchCtrl
 * @description
 * # SearchCtrl
 * Controller of the search page
 */
angular.module('kaptureApp')
  .controller('SearchCtrl', ['$scope','$stateParams','searchService', 'downloadService', '$rootScope', 'DTOptionsBuilder', '$q',
      function( $scope, $stateParams, searchService, downloadService, $rootScope, DTOptionsBuilder, $q ) {


    $scope.query      = $stateParams.query;
    $scope.results    = [];
    $scope._          = _;

    $scope.isLoading  = searchService.isLoading;
    $scope.download   = downloadService.add;


    // filters fields to allow selecting
    var allowedFilters = [
      {'key': 'sourceName', 'displayName': 'Source'},
      {'key': 'category',   'displayName': 'Category'},
      {'key': 'mediaType',  'displayName': 'Media Type'},
      {'key': 'size',       'displayName': 'Size'},
      {'key': 'uploaded',   'displayName': 'Uploaded'}
    ];


    // for all the results that are returned, get the unique entries to filter upon
    function getFiltersAndValues( results ) {
      // gets list of keys in entire results array
      var keys = [];
      results.forEach(function(k) {
        keys = _.union( keys, Object.keys(k) );
      });

      // finds the unique values of each key and store them in a way
      // we can easily lookup via ng-repeat and filters
      return keys.map(function(k) {
        if( _.some( allowedFilters, {'key':k} )) {
          return {
            name:        k,
            displayName: _.find( allowedFilters, {'key':k} ).displayName,
            values:      _.uniq( results.map(function(r) {
                          return r[k];
                         }))
          }
        }
      }).reduce(function( prev, cur ) {
        return prev.concat( cur || [] );
      },[]);
    }

    // run query through search service and handle it
    function getResults() {
      searchService
        .search( $stateParams.query )
        .then(function( results ){
          $scope.results = results;
          $scope.filters = getFiltersAndValues( results );
          $scope.updateResultsFromFilters();
        });
    }


    $scope.dtInstance = {};

    $scope.updateResultsFromFilters = function updateResultsFromFilters() {
      // wrap in a promise as we want to wait for this to be done to rerender table
      return $q(function(resolve, reject) {

        // for each result, apply each of the filters to it, and if they match correctly
        // then mark the item in the results array with 'displayed' to filter based on
        $scope.results.forEach(function(r, r_idx, r_arr) {

          var allFilterMatches = $scope.filters.map(function(f){

            // lets make sure there are actually selected values first
            // otherwise this filter can pass
            if( f.selected && _.some( f.selected, Boolean ) ) {

              // for each selected filter, find anything that is selected and matches
              // the filter we're comparing
              //TODO: filter ranges
              var filterResults = Object.keys( f.selected ).map(function(sel) {
                return f.selected[sel] && r[f.name] === f.values[sel];
              });

              // we can assume its okay if something matches in there
              return _.some( filterResults, Boolean );
            } else {
              return true;
            }
          });

          // we want ALL of the above to be true so its displayed
          if( _.every( allFilterMatches, Boolean ) ) {
            $scope.results[r_idx].displayed = true;
          } else {
            $scope.results[r_idx].displayed = false;
          }
        });

        // send to $apply, then rerender
        resolve( $scope.results );

      });
    }

    // some table options for datatables
    $scope.dtTableOpts = DTOptionsBuilder.newOptions()
      .withDisplayLength(25)
      .withBootstrap()
      .withOption('bInfo', false)
      .withOption('bFilter', false)
      .withOption('bLengthChange', false)
      .withOption('order', [3, 'desc']);

    $scope.$on( '$destroy', function() {
      $rootScope.$broadcast( 'clearSearchInput' );
    });

    // init
    getResults();

	}]);
