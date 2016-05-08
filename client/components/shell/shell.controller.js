'use strict';

angular.module('kaptureApp')
  .controller('ShellCtrl', function ($mdSidenav, $mdDialog, $mdMedia, $scope, $location) {

    $scope.menuItems = [
      { href: '/watch',      title: 'Watch',       icon: 'notification:live_tv'},
      { href: '/get',        title: 'Get',         icon: 'file:cloud_download'},
      { href: '/autokapture',title: 'AutoKapture', icon: 'action:autorenew' },
      { href: '/downloads',  title: 'Downloads',   icon: 'file:file_download' },
      { href: '/settings',   title: 'Settings',    icon: 'action:settings' },
    ];

    $scope.showAddUrlDialog = function(ev) {
      var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'));
      $mdDialog.show({
        controller: 'AddUrlDialogController',
        templateUrl: 'components/addurl/addurl.dialog.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose: true,
        fullscreen: useFullScreen
      })
    };

    $scope.isActive = function(route) {
      return route === $location.path();
    };

    $scope.toggleMenu = function() {
      $mdSidenav('menu').toggle();
    };
  });
