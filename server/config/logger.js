'use strict';

var winston = require('winston');

module.exports = function() {
  var loglevel = 'info';

  if( process.env.LOG_LEVEL ) {
    loglevel = process.env.LOG_LEVEL;
  } else if( process.env.NODE_ENV === 'development' ) {
    loglevel = 'debug';
  }

  console.log('log level', loglevel );

  return new (winston.Logger)({
    transports: [
      new (winston.transports.Console)({
        colorize: process.env.NODE_ENV === 'production' ? false : true,
        prettyPrint: true,
        timestamp: true,
        stderrLevels: ['error'],
        level: loglevel
      })
    ]
  })
};
