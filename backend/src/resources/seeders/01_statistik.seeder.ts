import { DataSource } from 'typeorm';

import { MStatistikEntity } from '../../entities/m-statistik.entity';

/* Seeder mengisi data yang cukup untuk MENGUJI tiap cabang, bukan data yang
   banyak. Selalu periksa dulu apakah tabel sudah berisi — seeder harus aman
   dijalankan ulang. */
export async function seedStatistik(dataSource: DataSource) {
  const repo = dataSource.getRepository(MStatistikEntity);

  if (await repo.count()) {
    console.log('✅ Statistik: sudah ada — dilewati');
    return;
  }

  // Ada yang bersuffix dan ada yang tidak, supaya tampilan keduanya teruji
  await repo.save(
    repo.create([
      { label: 'UT Daerah', nilai: 40, suffix: '+', urutan: 1 },
      { label: 'Fakultas', nilai: 4, suffix: null, urutan: 2 },
      { label: 'Mahasiswa Baru', nilai: 40000, suffix: '+', urutan: 3 },
      { label: 'Program Studi', nilai: 500, suffix: '+', urutan: 4 },
    ]),
  );

  console.log('✅ Statistik: 4 baris');
}
