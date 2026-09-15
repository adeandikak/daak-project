import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
// CommonJS: tsconfig template tidak memakai esModuleInterop, jadi default
// import akan bernilai undefined. Namespace import mengembalikan module.exports
// yang memang berupa fungsi.
import * as cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';

import { AppModule } from './application/app.module';
import { GlobalExceptionFilter } from './infrastructure/utils/exception';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Cookie httpOnly dibaca AuthGuard, jadi parser-nya wajib dipasang
  app.use(cookieParser());

  // Security headers
  app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
  app.use(helmet.hsts({ maxAge: 15552000, includeSubDomains: true }));
  app.getHttpAdapter().getInstance().disable('x-powered-by');

  // Trust proxy → req.ip = IP klien asli (kunci rate-limit)
  app.getHttpAdapter().getInstance().set('trust proxy', 1);

  // Prefix global API → /api/v1/...
  app.setGlobalPrefix('api');

  const isProd =
    process.env.NODE_ENV === 'production' || process.env.APP_ENV === 'production';

  // CORS
  const stripSlash = (s: string) => s.trim().replace(/\/+$/, '');

  const allowedOrigins = (process.env.FRONTEND_URL || '')
    .split(',')
    .map(stripSlash)
    .filter(Boolean);

  app.enableCors({
    origin: (origin: string | undefined, cb: (err: Error | null, allow: boolean) => void) => {
      // Request non-browser (curl/server-to-server) tanpa Origin → izinkan
      if (!origin) return cb(null, true);
      const o = stripSlash(origin);
      const allowed =
        allowedOrigins.includes(o) ||
        // Izinkan semua localhost / 127.0.0.1 (port mana pun) — hanya non-produksi
        (!isProd && (o.startsWith('http://localhost:') || o.startsWith('http://127.0.0.1:')));
      cb(null, allowed);
    },
    credentials: true,
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
    exposedHeaders: ['Content-Disposition'],
    optionsSuccessStatus: 204,
  });

  // Filter exception global — format { success, message, errors }
  app.useGlobalFilters(new GlobalExceptionFilter());

  // Validasi global — tolak field asing, transform tipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  /* Pembatas khusus endpoint sensitif ditulis DI SINI, bukan di controller,
     supaya seluruh pembatas terlihat di satu tempat. */
  app.use('/api/v1/auth/login', rateLimit({
    windowMs: 60 * 1000,
    max: 5,
    message: {
      success: false,
      message: 'Terlalu banyak percobaan masuk. Coba lagi dalam 1 menit.',
      errors: null,
    },
    standardHeaders: true,
    legacyHeaders: false,
  }));

  app.use('/api/v1/auth/captcha', rateLimit({
    windowMs: 60 * 1000,
    max: 30,
    message: {
      success: false,
      message: 'Terlalu banyak permintaan captcha. Coba lagi sebentar lagi.',
      errors: null,
    },
    standardHeaders: true,
    legacyHeaders: false,
  }));

  // Rate limiting global
  app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 200 }));

  // Swagger — hanya non-produksi
  if (!isProd) {
    const config = new DocumentBuilder()
      .setTitle(`${process.env.APP_NAME || 'DAAK'} API`)
      .setDescription('Dokumentasi API — hanya tersedia di luar produksi')
      .setVersion('1.0')
      .addBearerAuth()
      .build();
    SwaggerModule.setup('api-docs', app, SwaggerModule.createDocument(app, config));
  }

  const port = process.env.PORT || 3020;
  await app.listen(port);
  console.log(`\n🚀 ${process.env.APP_NAME || 'DAAK_BE'} berjalan di port ${port}`);
  console.log(`📖 Swagger: http://localhost:${port}/api-docs\n`);
}

void bootstrap();
