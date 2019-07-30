import { transports, format, LoggerOptions } from 'winston';
const { combine, timestamp, label, printf } = format;

export interface ErrorRes {
  statusCode: number;
  path: string;
  type: string;
  message: string;
}

interface ErrorLog {
  res: ErrorRes;
  stack?: string;
}

// add path to request in logs
const myFormat = printf((info): string => {
  const {timestamp, label, level, message, errors, statusCode, path, type, stack } = info;

  const res = {
    type,
    path,
    statusCode,
    message,
    errors,
  }

  return `${timestamp} [${label}] Lv: ${level}, Response: ${JSON.stringify(res)}` + (stack ? `\n ${stack} \n` : '');
});

export const loggerConfig: LoggerOptions = {
  format: combine(
    label({ label: 'Logger 1' }),
    timestamp({ format: 'DD/MM/YYYY HH:mm:ss' }),
    myFormat,
  ),
  transports: [
    new transports.Console({
      level: process.env.NODE_ENV === 'production' ? 'error' : 'debug',
    }),
    new transports.File({ filename: 'debug.log', level: 'debug'  }),
    new transports.File({ filename: 'error.log', level: 'error' }),
  ],
};
