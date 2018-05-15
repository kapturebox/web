'use strict';

var KaptureApp = function() {
  this.queryInput = element(by.model('query'));
  this.header = element(by.css('h1.page-header'));
  this.filterButtons = element.all(by.css('.filter-button'));
  this.filterPopover = element(by.css('.popover'));

  this.searchFilterPopupValues = element.all(by.repeater('filterVal in filter.values'));
  this.searchResults = element.all(by.repeater('item in results'));

  this.searchResultSeries = this.searchResults.filter( elem => {
    return elem.evaluate('item.mediaType').then( type => {
      return type === 'series';
    });
  });

  this.toastPopup = element(by.css('.toast'));

  this.autoKaptureLink = element(by.css('a[ui-sref="nav.autokapture"]'));
};

module.exports = new KaptureApp();

