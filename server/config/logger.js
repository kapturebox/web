'use strict';

var winston = require('winston');

module.exports = function() {
  return new (winston.Logger)({
    transports: [
      new (winston.transports.Console)({
        colorize: true,
        prettyPrint: true,
        timestamp: true,
        stderrLevels: ['error'],
        level: process.env.NODE_ENV == 'production' ? 'info' : 'debug'
      })
    ]
  })
};
