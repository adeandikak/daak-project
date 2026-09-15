import { createLogger, format, transports } from 'winston';
import { join } from 'path';

/* Logger tunggal aplikasi. Galat tak tertangani ditulis ke berkas supaya
   jejaknya tetap ada setelah proses mati; di luar produksi juga dicetak
   ke konsol agar terlihat saat pengembangan. */

const LOG_PATH = process.env.LOG_PATH || 'logs';
const isProd =
  process.env.NODE_ENV === 'production' || process.env.APP_ENV === 'production';

export const logger = createLogger({
  level: isProd ? 'info' : 'debug',
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.errors({ stack: true }),
    format.json(),
  ),
  defaultMeta: { service: process.env.APP_NAME || 'DAAK_BE' },
  transports: [
    new transports.File({
      filename: join(process.cwd(), LOG_PATH, 'error.log'),
      level: 'error',
      maxsize: 5 * 1024 * 1024,
      maxFiles: 5,
    }),
    new transports.File({
      filename: join(process.cwd(), LOG_PATH, 'app.log'),
      maxsize: 5 * 1024 * 1024,
      maxFiles: 5,
    }),
  ],
});

if (!isProd) {
  logger.add(
    new transports.Console({
      format: format.combine(format.colorize(), format.simple()),
    }),
  );
}
