import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { V1Module } from './v1/v1.module';

/* Daftar entity DIDAFTARKAN EKSPLISIT, bukan lewat glob `entities/*.ts`.
   Glob memuat berkas apa pun yang kebetulan ada di folder — termasuk entity
   yang tabelnya belum dimigrasikan — dan galatnya baru muncul saat runtime.
   Tiap modul baru menambahkan entity-nya di sini (lihat docs/PANDUAN.md). */
import { TPengumumanEntity } from '../entities/t-pengumuman.entity';
import { MStatistikEntity } from '../entities/m-statistik.entity';
import { TBeritaEntity } from '../entities/t-berita.entity';
import { MStafEntity } from '../entities/m-staf.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),

    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'postgres' as const,
        host: process.env.TYPEORM_HOST || 'localhost',
        port: parseInt(process.env.TYPEORM_PORT || '5432'),
        username: process.env.TYPEORM_USERNAME || 'postgres',
        password: process.env.TYPEORM_PASSWORD || '',
        database: process.env.TYPEORM_DATABASE || 'daak_portal',
        schema: process.env.TYPEORM_SCHEMA || 'public',
        entities: [TPengumumanEntity, MStatistikEntity, TBeritaEntity, MStafEntity],
        /* Skema dikelola migrasi SQL (resources/migrations). `synchronize`
           TypeORM mati kecuali diminta eksplisit: menyalakannya di atas tabel
           hasil migrasi membuat TypeORM "membetulkan" panjang varchar dengan
           drop+add kolom, dan gagal di tabel yang sudah berisi data. */
        synchronize: process.env.TYPEORM_SYNC === 'true',
        logging: ['error'] as const,
        // Ketahanan koneksi — koneksi basi/hang pada pool Postgres.
        connectTimeoutMS: 10000,
        extra: {
          max: 10,
          idleTimeoutMillis: 30000,
          keepAlive: true,
          keepAliveInitialDelayMillis: 10000,
          statement_timeout: 30000,
        },
      }),
    }),

    // Seluruh endpoint API v1
    V1Module,
  ],
})
export class AppModule {}
