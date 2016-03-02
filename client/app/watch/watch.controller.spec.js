'use strict';

describe('Controller: WatchCtrl', function () {

  // load the controller's module
  beforeEach(module('kaptureApp'));

  var WatchCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    WatchCtrl = $controller('WatchCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
