'use strict';

describe('Dashboard View', function() {
  var page;

  beforeEach(function() {
    browser.get('/');
    page = require('./dashboard.po');
  });


  it('should allow a search', function() {
    page.queryInput.sendKeys('sunny').submit();
    expect(page.header.getText()).toBe('Search Results: sunny');

    page.filterButtons.first().click();


    page.searchFilterPopupValues
      .map(e => e.getText())
    .then(function(sourceFilter){
      expect(sourceFilter.length).toBeGreaterThanOrEqual(2);
      expect(sourceFilter).toContain("ThePirateBay");
    });

    // useful for debugging
    // browser.pause();
  });
});
