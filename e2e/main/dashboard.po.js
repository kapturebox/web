/**
 * This file uses the Page Object pattern to define the main page for tests
 * https://docs.google.com/presentation/d/1B6manhG0zEXkC-H-tPo2vwU06JhL8w9-XCF9oehXzAQ
 */

'use strict';

var Dashboard = function() {
  this.queryInput = element(by.model('query'));
  this.header = element(by.css('h1.page-header'));
  this.filterButtons = element.all(by.css('.filter-button'));
  this.filterPopover = element(by.css('.popover'));

  this.searchFilterPopupValues = element.all(by.repeater('filterVal in filter.values'));
};

module.exports = new Dashboard();

