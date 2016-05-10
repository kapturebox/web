'use strict';

describe('Directive: kpFiletypeIcon', function () {

  // load the directive's module and view
  beforeEach(module('kaptureApp'));
  beforeEach(module('app/kp-filetype-icon/kp-filetype-icon.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<kp-filetype-icon></kp-filetype-icon>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the kpFiletypeIcon directive');
  }));
});