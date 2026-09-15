import { DataSource } from 'typeorm';

import { TBeritaEntity } from '../../entities/t-berita.entity';

/* `ikon` memakai NAMA ikon lucide, dipetakan ke komponen di FE
   src/utils/icons.ts. Nama yang belum terdaftar di sana jatuh ke ikon
   bawaan tanpa galat — tambahkan pemetaannya setiap memakai ikon baru. */
export async function seedBerita(dataSource: DataSource) {
  const repo = dataSource.getRepository(TBeritaEntity);

  if (await repo.count()) {
    console.log('✅ Berita: sudah ada — dilewati');
    return;
  }

  // Empat baris, sementara Beranda hanya menampilkan tiga — memastikan
  // pemotongan `limit` benar-benar terpakai, bukan kebetulan pas.
  await repo.save(
    repo.create([
      {
        slug: 'ut-tingkatkan-layanan-akademik-e-campus',
        judul: 'UT Tingkatkan Layanan Akademik dengan Platform E-Campus Baru',
        ringkasan:
          'Dalam rangka memberikan kemudahan akses belajar jarak jauh bagi mahasiswa nasional dan global, DAAK merilis pembaruan ekosistem e-campus.',
        tanggal: '2026-06-03',
        kategori: 'Layanan',
        gradient_from: '#0A4C85',
        gradient_to: '#003366',
        ikon: 'box',
        tautan_url: '/panduan',
        created_by: 'seeder',
      },
      {
        slug: 'penerima-beasiswa-csr-mitra-diumumkan',
        judul: '35 Mahasiswa UT Penerima Beasiswa CSR Mitra Diumumkan',
        ringkasan:
          'Sebanyak 35 mahasiswa dari Program Studi Manajemen dan Sistem Informasi resmi dinyatakan berhak menerima beasiswa prestasi CSR Bank BUMN.',
        tanggal: '2026-05-29',
        kategori: 'Kemahasiswaan',
        gradient_from: '#2E6DA7',
        gradient_to: '#004080',
        ikon: 'circle-check',
        tautan_url: '/kemahasiswaan',
        created_by: 'seeder',
      },
      {
        slug: 'rapat-koordinasi-daak-ut-daerah-wisuda',
        judul: 'Rapat Koordinasi DAAK dan UT Daerah Matangkan Kesiapan Wisuda',
        ringkasan:
          'Guna memastikan keselarasan data kelulusan mahasiswa menjelang yudisium nasional, direktorat menyelenggarakan rapat koordinasi terpadu.',
        tanggal: '2026-05-24',
        kategori: 'Akademik',
        gradient_from: '#FFCC00',
        gradient_to: '#997A00',
        ikon: 'flag',
        tautan_url: '/kelulusan',
        created_by: 'seeder',
      },
      {
        slug: 'sosialisasi-rpl-terintegrasi-kelulusan',
        judul: 'Sosialisasi RPL Terintegrasi Kelulusan di 40 UT Daerah',
        ringkasan:
          'Sosialisasi menyasar calon mahasiswa berpengalaman kerja agar dapat mengonversi capaian pembelajaran ke dalam satuan kredit semester.',
        tanggal: '2026-05-18',
        kategori: 'Akademik',
        gradient_from: '#0E7490',
        gradient_to: '#15265C',
        ikon: 'graduation-cap',
        tautan_url: '/panduan',
        created_by: 'seeder',
      },
    ]),
  );

  console.log('✅ Berita: 4 baris');
}
