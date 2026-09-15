import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

import { logger } from '../../config/logger.config';

/* Satu-satunya tempat galat berubah menjadi respons HTTP. Bentuknya sama
   dengan successResponse — { success, message, errors } — supaya FE tidak
   perlu membedakan cara membaca hasil sukses dan gagal. */
@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Terjadi kesalahan pada server';
    let errors: any = null;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (typeof exceptionResponse === 'object') {
        const resp = exceptionResponse as any;
        message = resp.message || message;
        errors = resp.errors || null;
      }
    } else {
      // Galat tak terduga: pesan ke klien tetap netral, detail masuk log
      const err = exception as any;
      logger.error('Unhandled exception', {
        message: err?.message || String(exception),
        stack: err?.stack,
        path: request.url,
      });
    }

    response.status(status).json({
      success: false,
      message,
      errors,
      timestamp: new Date().toISOString(),
    });
  }
}
