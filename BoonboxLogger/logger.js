'use strict';
const winston = require('winston');
const fs = require('fs');
const logInfodir = 'boonboxLogger/boonboxInfoLog';
const logErrDir = 'boonboxLogger/boonboxErrorLog';

// Create the log directory if it does not exist
if (!fs.existsSync(logErrDir,logInfodir)) {
    fs.mkdirSync(logErrDir);
    fs.mkdirSync(logInfodir);
}

const tsFormat = () => (new Date()).toLocaleTimeString();
const logger =  winston.createLogger ({
    transports: [
        new (require('winston-daily-rotate-file'))({
            filename: `${logErrDir}/errorResults`,
            timestamp: tsFormat,
            datePattern: 'MM-DD-YYYY',
            prepend: true,
            maxsize: '1g',
            maxFiles:'30d',
            "zippedArchive": true,
            level: 'error'
        }),
        new (require('winston-daily-rotate-file'))({
            filename: `${logInfodir}/infoResults`,
            timestamp: tsFormat,
            datePattern: 'MM-DD-YYYY',
            prepend: true,
            maxsize: '1g',
            maxFiles:'30d',
            "zippedArchive": true,
            level: 'info'
        })

    ]
        
});

module.exports  = logger;