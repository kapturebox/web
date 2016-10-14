'use strict';

describe('Controller: AutoKaptureCtrl', function () {

  // load the controller's module
  beforeEach(module('kaptureApp'));

  var AutoKaptureCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AutoKaptureCtrl = $controller('AutoKaptureCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
