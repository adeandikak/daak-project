import * as dotenv from 'dotenv';
import { readdirSync, readFileSync } from 'fs';
import { join } from 'path';
import { DataSource } from 'typeorm';

dotenv.config();

/* Pelari migrasi SQL sederhana: menjalankan seluruh berkas .sql di folder ini
   urut nama, lalu mencatat yang sudah dijalankan di tabel `_migrasi`.
   Berkas migrasi sendiri sudah ditulis idempoten (IF NOT EXISTS), jadi
   menjalankan ulang tetap aman meski catatannya hilang.

   npm run migrate
*/
const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.TYPEORM_HOST || 'localhost',
  port: parseInt(process.env.TYPEORM_PORT || '5432'),
  username: process.env.TYPEORM_USERNAME || 'postgres',
  password: process.env.TYPEORM_PASSWORD || '',
  database: process.env.TYPEORM_DATABASE || 'daak_portal',
  schema: process.env.TYPEORM_SCHEMA || 'public',
  logging: ['error'],
});

async function run() {
  console.log('\n📦 Menjalankan migrasi...\n');

  await AppDataSource.initialize();

  await AppDataSource.query(`
    CREATE TABLE IF NOT EXISTS _migrasi (
      id         SERIAL PRIMARY KEY,
      berkas     VARCHAR(255) NOT NULL UNIQUE,
      dijalankan TIMESTAMP    NOT NULL DEFAULT NOW()
    )
  `);

  const sudah: string[] = (
    await AppDataSource.query('SELECT berkas FROM _migrasi')
  ).map((r: { berkas: string }) => r.berkas);

  const berkas = readdirSync(__dirname)
    .filter((f) => f.endsWith('.sql'))
    .sort();

  for (const f of berkas) {
    if (sudah.includes(f)) {
      console.log(`- ${f}: sudah pernah dijalankan`);
      continue;
    }

    const sql = readFileSync(join(__dirname, f), 'utf8');
    await AppDataSource.query(sql);
    await AppDataSource.query('INSERT INTO _migrasi (berkas) VALUES ($1)', [f]);
    console.log(`✅ ${f}`);
  }

  await AppDataSource.destroy();
  console.log('\n🎉 Migrasi selesai!\n');
}

run().catch((err) => {
  console.error('❌ Migrasi gagal:', err);
  process.exit(1);
});
