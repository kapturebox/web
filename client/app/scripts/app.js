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
    'angular-loading-bar',
    'datatables',
    'datatables.bootstrap'
  ])
  .constant('mockSearchResults', false)
  .constant('debugMode', false)
  .config(['$uibTooltipProvider', function ($uibTooltipProvider) {
    var parser = new UAParser();
    var result = parser.getResult();
    var touch = result.device && (result.device.type === 'tablet' || result.device.type === 'mobile');
    if (touch) {
      $uibTooltipProvider.options({ trigger: 'dontTrigger' });
    } else {
      $uibTooltipProvider.options({ trigger: 'mouseenter' });
    }
  }])
  .config(['$stateProvider', '$urlRouterProvider', '$locationProvider', 'cfpLoadingBarProvider',
    function ($stateProvider, $urlRouterProvider, $locationProvider, cfpLoadingBarProvider) {

      $locationProvider.html5Mode(true);

      cfpLoadingBarProvider.includeSpinner = false;

      $urlRouterProvider.otherwise('/dashboard');

      $stateProvider
        .state('nav', {
          templateUrl: 'app/views/dashboard/main.html'
        })
        .state('nav.dashboard', {
          url: '/dashboard',
          controller: 'MainCtrl',
          templateUrl: 'app/views/dashboard/home.html'
        })
        .state('nav.search', {
          url: '/search/:query',
          controller: 'SearchCtrl',
          templateUrl: 'app/views/pages/search/search.html'
        })
        .state('nav.downloads', {
          url: '/downloads',
          controller: 'DownloadCtrl',
          templateUrl: 'app/views/pages/downloads/downloads.html'
        })
        .state('watch', {
          url: '/watch/:videoId',
          params: {
            videoId: null
          },
          controller: 'WatchCtrl',
          templateUrl: 'app/views/pages/watch/watch.html'
        })
        .state('nav.autokapture', {
          url: '/autokapture',
          controller: 'AutokaptureCtrl',
          templateUrl: 'app/views/pages/autokapture/autokapture.html'
        })
        .state('nav.help', {
          url: '/help',
          controller: 'HelpCtrl',
          templateUrl: 'app/views/pages/help/help.html'
        })
        .state('nav.settings', {
          url: '/settings',
          controller: 'SettingsCtrl',
          templateUrl: 'app/views/pages/settings/settings.html'
        })

        // unused still
        .state('login', {
          templateUrl: 'app/views/pages/login.html',
          url: '/login'
        })

    }]);

// needed to get config before instanciating the rest of the app
angular.element(document).ready(function () {
    $.get('/config', function (config) {
        angular.module('kaptureApp').constant('serverEndpoint', config.SERVER_ENDPOINT);
        angular.bootstrap(document, ['kaptureApp']);
    });
});
