'use strict';

describe('Controller: GetCtrl', function () {

  // load the controller's module
  beforeEach(module('kaptureApp'));

  var GetCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    GetCtrl = $controller('GetCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
