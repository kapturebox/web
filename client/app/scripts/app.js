'use strict';



/**
 * @ngdoc overview
 * @name kaptureApp
 * @description
 * # kaptureApp
 *
 * Main module of the application.
 */
angular
  .module('kaptureApp', [
    'ui.router',
    'ui.bootstrap',
    'ngAnimate',
    'yaru22.md',
    'angularMoment',
    'angular-humanize',  
    'angular-loading-bar'
  ])
  .config(['$stateProvider','$urlRouterProvider','$locationProvider','cfpLoadingBarProvider',
        function ($stateProvider,$urlRouterProvider,$locationProvider, cfpLoadingBarProvider) {

    $locationProvider.html5Mode( true );

    cfpLoadingBarProvider.includeSpinner = false;

    $urlRouterProvider.otherwise('/dashboard');

    $stateProvider
      .state('nav', {
        templateUrl: 'app/views/dashboard/main.html'
      })
      .state('nav.dashboard',{
        url:'/dashboard',
        controller: 'MainCtrl',
        templateUrl:'app/views/dashboard/home.html'
      })
      .state( 'nav.search', {
        url: '/search/:query',
        controller: 'SearchCtrl',
        templateUrl: 'app/views/pages/search.html'
      })
      .state( 'nav.downloads', {
        url: '/downloads',
        controller: 'DownloadCtrl',
        templateUrl: 'app/views/pages/downloads.html'
      })
      .state( 'watch', {
        url: '/watch/:videoId',
        controller: 'WatchCtrl',
        templateUrl: 'app/views/pages/watch.html'
      })
      .state( 'nav.autokapture', {
        url: '/autokapture',
        controller: 'AutokaptureCtrl',
        templateUrl: 'app/views/pages/autokapture.html'
      })
      .state( 'nav.help', {
        url: '/help',
        controller: 'HelpCtrl',
        templateUrl: 'app/views/pages/help.html'
      })







      .state('login',{
        templateUrl:'app/views/pages/login.html',
        url:'/login'
      })

}]);

    
