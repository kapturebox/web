'use strict';

describe('Controller: DownloadsCtrl', function () {

  // load the controller's module
  beforeEach(module('kaptureApp'));

  var DownloadsCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    DownloadsCtrl = $controller('DownloadsCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
