const winston = require('winston');
require('winston-daily-rotate-file');

const dateformat = require('dateformat');
const config = require('./config');

// silly, debug, verbose, info, warn, error
const level = config.get('log_options').level;
const filename = config.get('log_options').filename;
const filesize = config.get('log_options').filesize;
const filecount = config.get('log_options').filecount;

let timestampFn = function () {
    let now = new Date();
    return dateformat(now, "yyyy-mm-dd HH:MM:ss");
};

let logger = new winston.Logger({
    level: level,
    transports: [
        new winston.transports.Console({
            prettyPrint: true,
            colorize: true,
            timestamp: timestampFn,
            handleExceptions: true
        }),
        // new winston.transports.DailyRotateFile({
        //     filename: filename,
        //     datePattern: '.yyyy-MM-dd.log',
        //     timestamp: timestampFn,
        //     maxsize: filesize,
        //     maxFiles: filecount,
        //     json: false
        // })
    ]
});

module.exports = logger;

