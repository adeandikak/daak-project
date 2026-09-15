import * as bcrypt from 'bcryptjs';
import { DataSource } from 'typeorm';

import { MStafEntity } from '../../entities/m-staf.entity';

/* Akun demo untuk mencoba halaman login. Kata sandi di-hash bcrypt dengan
   cost 10 — sama seperti yang dipakai saat login memverifikasi.

   GANTI kata sandi ini sebelum dipakai di lingkungan nyata. */
export async function seedStaf(dataSource: DataSource) {
  const repo = dataSource.getRepository(MStafEntity);

  if (await repo.count()) {
    console.log('✅ Staf: sudah ada — dilewati');
    return;
  }

  const BENIH = [
    {
      nama: 'Administrator DAAK',
      email: 'admin@ecampus.ut.ac.id',
      jabatan: 'Administrator Sistem',
      sandi: 'DaakAdmin2026',
    },
    {
      nama: 'Petugas Layanan Akademik',
      email: 'staf@ecampus.ut.ac.id',
      jabatan: 'Staf Layanan Akademik',
      sandi: 'DaakStaf2026',
    },
  ];

  await repo.save(
    repo.create(
      BENIH.map((s) => ({
        nama: s.nama,
        email: s.email.toLowerCase(),
        password_hash: bcrypt.hashSync(s.sandi, 10),
        jabatan: s.jabatan,
        is_active: true,
        created_by: 'seeder',
      })),
    ),
  );

  console.log(`✅ Staf: ${BENIH.length} akun`);
  console.log('   admin@ecampus.ut.ac.id / DaakAdmin2026');
  console.log('   staf@ecampus.ut.ac.id  / DaakStaf2026');
}
