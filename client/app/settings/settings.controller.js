'use strict';

angular.module('kaptureApp')
  .controller('SettingsCtrl', function ($scope, $http, $mdToast) {
      $http({
        method: 'GET',
        url:    '/api/settings'
      }).then(function(results) {
        $scope.settings = results.data;
      });

      $scope.applyingSettings = false;

      $scope.submitSettings = function(  ) {
        $scope.applyingSettings = true;
        if( $scope.settingsForm.$valid ) {
          $http({
            method:    'POST',
            url:       '/api/settings',
            data:      $scope.settings,
            headers:   { 'Content-Type': 'application/json' }
          }).then(function(response) {
            $scope.applyingSettings = false;

            $mdToast.show(
              $mdToast.simple()
                .textContent( 'Settings saved successfully!' )
                .hideDelay( 2000 )
            );
          }).catch(function(err) {
            $scope.applyingSettings = false;
            $mdToast.show(
              $mdToast.simple()
                .textContent( 'Unable to save settings' )
                .hideDelay( 2000 )
            );
          });
        }
      }

      $scope.sources = [
        {name: 'ShowRSS', link: 'http://showrss.info', id: 'showrss', enabled: true,  description: 'Constantly updated TV shows'},
        {name: 'Kickass',  link: 'https://kat.cr',     id: 'kat',     enabled: false, description: 'Broad array of content provided by users'}
      ]

  });
