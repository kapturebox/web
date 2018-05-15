'use strict';

describe('AutoKapture View', function() {

  var page;
  var EC;



  beforeEach(function() {
    browser.manage().window().setSize(1600, 1000);
    browser.get('/');
    page = require('./app.po');
    EC = protractor.ExpectedConditions;
  });




  it('should see if an autokapture addition works', () => {
    page.autoKaptureLink.click();

    

    browser.pause();

  }); 
});
