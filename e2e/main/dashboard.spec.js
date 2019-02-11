'use strict';

describe('Dashboard View', function() {
  var page;
  var EC;

  beforeEach(function() {
    browser.manage().window().setSize(1600, 1000);
    browser.get('/');
    page = require('./dashboard.po');
    EC = protractor.ExpectedConditions;
  });


  it('should allow a search', function() {
    page.queryInput.sendKeys('sunny').submit();
    expect(page.header.getText()).toBe('Search Results: sunny');

    browser.wait(EC.visibilityOf($('.panel-body')), 5000);
    page.filterButtons.first().click();

    page.searchFilterPopupValues
      .map(e => e.getText())
      .then(function(sourceFilter){
        // expect(sourceFilter.length).toBeGreaterThanOrEqual(3);
        expect(sourceFilter).toContain("TorrentSearch");
        expect(sourceFilter).toContain("ShowRss");
        expect(sourceFilter).toContain("Youtube");
      });

    // check that we have normal downloadable results, and click one
    var tpb = page.searchFilterPopupValues.filter(fVals => {
      return fVals.getText().then(txt => {
        return txt === 'TorrentSearch';
      });
    })

    expect(tpb.count()).toBeGreaterThan(0);
    tpb.first().click();

    page.searchResults
      .get(0)
      .all(by.css('button.adhoc'))
      .first()
      .click();

    browser.wait(EC.visibilityOf(page.toastPopup), 5000);
    expect(page.toastPopup.getText()).toContain('Download started');

    // // check that we have 'series' results and can start one
    // expect(page.searchResultSeries.count()).toBeGreaterThan(0);

    // browser.pause();


  });
});
