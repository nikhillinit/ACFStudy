import pino from 'pino';

const isDevelopment = process.env.NODE_ENV === 'development';

export const logger = pino({
  level: process.env.LOG_LEVEL || (isDevelopment ? 'debug' : 'info'),
  transport: isDevelopment ? {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'HH:MM:ss',
      ignore: 'pid,hostname'
    }
  } : undefined,
  base: {
    pid: false,
    hostname: false
  }
});

// Helper functions for common log patterns
export const logRequest = (method: string, url: string, statusCode: number, responseTime?: number) => {
  logger.info({
    method,
    url,
    statusCode,
    responseTime: responseTime ? `${responseTime}ms` : undefined
  }, 'HTTP Request');
};

export const logError = (error: Error, context?: string) => {
  logger.error({
    error: {
      message: error.message,
      stack: error.stack,
      name: error.name
    },
    context
  }, 'Error occurred');
};

export const logAuth = (action: string, userId?: string, success: boolean = true) => {
  logger.info({
    action,
    userId,
    success
  }, 'Auth event');
};

export const logDatabase = (operation: string, table?: string, duration?: number) => {
  logger.debug({
    operation,
    table,
    duration: duration ? `${duration}ms` : undefined
  }, 'Database operation');
};