import { DataSource } from 'typeorm';

import { TPengumumanEntity } from '../../entities/t-pengumuman.entity';

export async function seedPengumuman(dataSource: DataSource) {
  const repo = dataSource.getRepository(TPengumumanEntity);

  if (await repo.count()) {
    console.log('✅ Pengumuman: sudah ada — dilewati');
    return;
  }

  // Tiap status muncul sekali agar ketiga warna badge teruji di layar
  await repo.save(
    repo.create([
      {
        judul: 'Registrasi Semester Ganjil 2026/2027 Resmi Dibuka',
        tanggal: '2026-06-04',
        status: 'penting',
        isi:
          'Mulai hari ini, seluruh mahasiswa aktif dan baru program Diploma, Sarjana, dan ' +
          'Pascasarjana dapat melakukan pengisian Kartu Rencana Studi (KRS) secara online ' +
          'melalui portal DAAK. Batas akhir registrasi mata kuliah adalah 31 Juli 2026.',
        cta_label: 'Buka Pengisian KRS',
        cta_url: '/registrasi',
        created_by: 'seeder',
      },
      {
        judul: 'Jadwal Wisuda Tahun Akademik Periode II Tahun 2026',
        tanggal: '2026-06-01',
        status: 'baru',
        isi:
          'Wisuda Pusat UT di Pondok Cabe direncanakan akan berlangsung pada 25-26 Agustus 2026 ' +
          'secara hybrid. Pengisian konfirmasi kehadiran wisuda dapat diakses melalui portal DAAK ' +
          'di tab kelulusan mulai tanggal 10 Juni.',
        cta_label: 'Daftar Konfirmasi Wisuda',
        cta_url: '/kelulusan',
        created_by: 'seeder',
      },
      {
        judul: 'Perubahan Kalender Akademik untuk Pelaksanaan UAS',
        tanggal: '2026-05-28',
        status: 'update',
        isi:
          'Direktorat mengumumkan penyesuaian jadwal pelaksanaan Ujian Akhir Semester (UAS) yang ' +
          'sebelumnya dijadwalkan mulai 20 Juni diundur menjadi 27 Juni 2026. Hal ini untuk ' +
          'memaksimalkan pelaksanaan tutorial online bagi mahasiswa.',
        cta_label: 'Lihat Panduan Akademik',
        cta_url: '/panduan',
        created_by: 'seeder',
      },
    ]),
  );

  console.log('✅ Pengumuman: 3 baris');
}
