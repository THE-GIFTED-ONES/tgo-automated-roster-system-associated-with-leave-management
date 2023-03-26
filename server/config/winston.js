const { createLogger, format } = require('winston');

const DailyRotateFile = require('winston-daily-rotate-file');

//Create Seperate Transports for different log levels
const errorTransport = new DailyRotateFile({
  filename: './logs/error-logs/error-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '14d',
  level: 'error',
});

const infoTransport = new DailyRotateFile({
  filename: './logs/info-logs/info-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '14d',
  level: 'info',
});

const combinedTransport = new DailyRotateFile({
  filename: './logs/combined-logs/combined-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '14d',
});

// //Configure the Format
// const myFormat = format.combine(
//   format.colorize({ all: true }),
//   format.timestamp({
//     format: 'YYYY-MM-DD hh:mm:ss.SSS A',
//   }),
//   format.align(),
//   format.printf((info) => `[${info.timestamp}] ${info.level}: ${info.message}`)
// );

// Create a logger with the transports
const logger = createLogger({
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD hh:mm:ss.SSS A' }),
    format.json()
  ),
  transports: [errorTransport, infoTransport, combinedTransport],
});

module.exports = logger;
