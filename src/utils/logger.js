import { createLogger, format, transports } from 'winston';

export default createLogger({
  format: format.combine(
    format.label({ label: 'page-loader' }),
    format.timestamp(),
    format.printf((info) => `${info.timestamp} [${info.label}] ${info.level}: ${info.message}`),
  ),
  transports: [new transports.File({ filename: 'page-loader.log' })],
});
