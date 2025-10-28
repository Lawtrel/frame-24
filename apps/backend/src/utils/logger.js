import winston from 'winston';

const customFormat = winston.format.combine(
    winston.format.splat(),
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.colorize(),
    winston.format.printf(info => {
        const { timestamp, level, message, ...meta } = info;

        const formattedLevel = level.replace(/\u001b\[\d+m/g, '');

        const metaString = Object.keys(meta).length > 0 ? ` ${JSON.stringify(meta)}` : '';

        return `[${timestamp}] [${formattedLevel.toUpperCase()}] ${message}${metaString}`;
    })
);

const logger = winston.createLogger({
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    format: customFormat,
    transports: [
        new winston.transports.Console({
            format: winston.format.combine(winston.format.colorize(), customFormat),
        }),


        ...(process.env.NODE_ENV === 'production' ? [
            new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
            new winston.transports.File({ filename: 'logs/combined.log' }),
        ] : [])
    ],
});

if (process.env.NODE_ENV !== 'production') {
    logger.debug('Winston Logger inicializado em modo de desenvolvimento.');
}

export default logger;