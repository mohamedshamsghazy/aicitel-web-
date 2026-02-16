import { createLogger, format, transports } from 'winston';

const { combine, timestamp, printf, colorize, errors } = format;

// Custom log format for cleaner output
const logFormat = printf(({ level, message, timestamp, stack, ...meta }) => {
    return `${timestamp} [${level}]: ${message} ${stack ? `\nStack: ${stack}` : ''} ${Object.keys(meta).length ? JSON.stringify(meta) : ''}`;
});

export const logger = createLogger({
    level: process.env.LOG_LEVEL || 'info', // 'debug' for dev, 'info' for prod
    format: combine(
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        errors({ stack: true }), // Capture stack trace
        process.env.NODE_ENV === 'development' ? colorize() : format.uncolorize(),
        logFormat
    ),
    transports: [
        new transports.Console(),
        // In a real enterprise setup, we would add:
        // new transports.File({ filename: 'error.log', level: 'error' }),
        // new transports.Http({ host: 'logs.datadoghq.com', path: '/v1/input' })
    ],
});

// Wrapper to ensure consistent usage
export const Logger = {
    info: (message: string, meta?: any) => logger.info(message, meta),
    warn: (message: string, meta?: any) => logger.warn(message, meta),
    error: (message: string, error?: any) => {
        if (error instanceof Error) {
            logger.error(message, { errorMessage: error.message, stack: error.stack, ...error });
        } else {
            logger.error(message, error);
        }
    },
    critical: (message: string, meta?: any) => logger.error(`[CRITICAL] ${message}`, meta),
};
