'use strict';

describe('Service: downloadService', function () {

  // load the service's module
  beforeEach(module('kaptureApp'));

  // instantiate service
  var downloadService;
  beforeEach(inject(function (_downloadService_) {
    downloadService = _downloadService_;
  }));

  it('should do something', function () {
    expect(!!downloadService).toBe(true);
  });

});
