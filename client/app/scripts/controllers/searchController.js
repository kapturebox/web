'use strict';
/**
 * @ngdoc function
 * @name kaptureApp.controller:SearchCtrl
 * @description
 * # SearchCtrl
 * Controller of the search page
 */
angular.module('kaptureApp')
  .controller('SearchCtrl', ['$scope','$stateParams','searchService', 'downloadService', '$rootScope', '$log', 'DTOptionsBuilder',
      function( $scope, $stateParams, searchService, downloadService, $rootScope, $log, DTOptionsBuilder ) {

    
		$scope.query      = $stateParams.query;
    $scope.results    = [];

    $scope.isLoading  = searchService.isLoading;
    $scope.download   = downloadService.add;

    searchService
      .search( $stateParams.query )
      .then(function( results ){
        $scope.results = results;
        $scope.filters = getFiltersAndValues( results );
      });

    var allowedFilters = [
      'sourceName',
      'category',
      'mediaType',
      'size',
      'uploaded'
    ];

    function getFiltersAndValues( results ) {
      // gets list of keys in entire results array
      var keys = [];
      results.forEach(function(k) { 
        keys = _.union( keys, Object.keys(k) ); 
      });

      // finds the unique values of each key and store them in a way
      // we can easily lookup via ng-repeat and filters
      return keys.map(function(k) {
        if( allowedFilters.includes(k) ) {
          return {
            name: k,
            values: _.uniq( results.map(function(r) {
              return r[k];
            }))
          }
        }
      }).reduce(function( prev, cur ) {
        return prev.concat( cur || [] );
      },[]);
    }

    // TODO: needs to be fixed, maybe make an object that sends to filter instead
    $scope.filterSelectedValues = function filterSelectedValues( val, idx, arr ) {
      return $scope.filters.map(function(f) {
        // $log.info( Array(f.selected) );
        return f.selected && f.selected.indexOf( true ).map(function(selIdx) {
          return val[f.name] === f.values[selIdx];
        }).includes( true );
      })
    }


    $scope.dtTableOpts = DTOptionsBuilder.newOptions()
      .withDisplayLength(25)
      .withBootstrap()
      .withOption('bInfo', false)
      .withOption('bFilter', false)
      .withOption('bLengthChange', false)
      .withOption('order', '-score')


    $scope.$on( '$destroy', function() {
      $rootScope.$broadcast( 'clearSearchInput' );
    });

	}]);
