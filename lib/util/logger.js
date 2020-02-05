'use strict';
const winston = require('winston');
const fs = require('fs');

const logFolder = '../../boonboxLogger';
const logInfo = 'InfoLog';
const logErr = 'ErrorLog';

// Create the log directory if it does not exist
if (!fs.existsSync(logFolder)) {
    fs.mkdirSync(logFolder);
}
if (!fs.existsSync(logFolder + "/" + logInfo)) {
    fs.mkdirSync(logFolder + "/" + logInfo);
}
if (!fs.existsSync(logFolder + "/" + logErr)) {
    fs.mkdirSync(logFolder + "/" + logErr);
}

const tsFormat = () => (new Date()).toLocaleTimeString();
const logWin = winston.createLogger({
    transports: [
        new (require('winston-daily-rotate-file'))({
            filename: `${logFolder}/${logErr}/errorResults`,
            timestamp: tsFormat,
            datePattern: 'MM-DD-YYYY',
            prepend: true,
            maxsize: '1g',
            maxFiles: '30d',
            "zippedArchive": true,
            level: 'error'
        }),
        new (require('winston-daily-rotate-file'))({
            filename: `${logFolder}/${logInfo}/infoResults`,
            timestamp: tsFormat,
            datePattern: 'MM-DD-YYYY',
            prepend: true,
            maxsize: '1g',
            maxFiles: '30d',
            "zippedArchive": true,
            level: 'info'
        })
    ]
});

module.exports = logWin;