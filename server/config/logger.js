'use strict';

var winston = require('winston');

module.exports = function(config, prepend) {
  prepend = prepend || '';
  return new (winston.Logger)({
    transports: [
      new (winston.transports.Console)({
        colorize: true,
        prettyPrint: true,
        timestamp: true,
        stderrLevels: ['error'],
        level: config.logger.loglevel || 'info',
        label: prepend
      })
    ]
  })
};
