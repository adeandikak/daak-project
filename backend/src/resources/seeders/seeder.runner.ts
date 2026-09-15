import * as dotenv from 'dotenv';
import { DataSource } from 'typeorm';

// Muat .env sebelum import seeder lainnya
dotenv.config();

import { seedStatistik } from './01_statistik.seeder';
import { seedPengumuman } from './02_pengumuman.seeder';
import { seedBerita } from './03_berita.seeder';
import { seedStaf } from './04_staf.seeder';

// Entity harus didaftarkan di sini juga — runner ini berdiri sendiri, tidak
// lewat AppModule. Tiap entity baru: tambahkan di app.module.ts DAN di sini.
import { TPengumumanEntity } from '../../entities/t-pengumuman.entity';
import { MStatistikEntity } from '../../entities/m-statistik.entity';
import { TBeritaEntity } from '../../entities/t-berita.entity';
import { MStafEntity } from '../../entities/m-staf.entity';

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.TYPEORM_HOST || 'localhost',
  port: parseInt(process.env.TYPEORM_PORT || '5432'),
  username: process.env.TYPEORM_USERNAME || 'postgres',
  password: process.env.TYPEORM_PASSWORD || '',
  database: process.env.TYPEORM_DATABASE || 'daak_portal',
  schema: process.env.TYPEORM_SCHEMA || 'public',
  entities: [TPengumumanEntity, MStatistikEntity, TBeritaEntity, MStafEntity],
  synchronize: false,
  logging: ['error'],
});

async function runSeeders() {
  console.log(`\n🌱 Memulai seeder ${process.env.APP_NAME || 'DAAK_BE'}...\n`);

  try {
    await AppDataSource.initialize();
    console.log('✅ Koneksi database berhasil\n');

    // Urutan mengikuti nomor berkas; belum ada ketergantungan antar tabel
    await seedStatistik(AppDataSource);
    await seedPengumuman(AppDataSource);
    await seedBerita(AppDataSource);
    await seedStaf(AppDataSource);

    console.log('\n🎉 Semua seeder selesai!\n');
  } catch (err) {
    console.error('❌ Seeder gagal:', err);
    process.exit(1);
  } finally {
    await AppDataSource.destroy();
  }
}

void runSeeders();
