<script setup lang="ts">
import { ArrowRight, Award, Calendar, CircleHelp, File, FileText, GraduationCap } from 'lucide-vue-next'
import type { Component } from 'vue'

/* Daftar layanan bersifat statis — tidak berubah dari basis data, jadi tidak
   perlu endpoint sendiri. Begitu isinya perlu dikelola admin, pindahkan ke
   tabel `m_layanan` dan buat modul BE-nya. */
interface Layanan {
  judul: string
  deskripsi: string
  tautan: string
  to: string
  warna: string
  ikon: Component
}

const layanan: Layanan[] = [
  {
    judul: 'Registrasi',
    deskripsi:
      'Registrasi mata kuliah, pengisian KRS, registrasi ujian ulang, dan cetak billing tagihan.',
    tautan: 'Registrasi Mandiri',
    to: '/registrasi',
    warna: 'icon-box-blue',
    ikon: FileText,
  },
  {
    judul: 'Kelulusan',
    deskripsi:
      'Pantau status yudisium, pendaftaran wisuda daerah maupun pusat, serta unggah berkas kelulusan.',
    tautan: 'Portal Kelulusan',
    to: '/kelulusan',
    warna: 'icon-box-sky',
    ikon: GraduationCap,
  },
  {
    judul: 'Kemahasiswaan',
    deskripsi:
      'Beasiswa prestasi dan KIP Kuliah, organisasi mahasiswa, prestasi, serta kesejahteraan.',
    tautan: 'Layanan Kemahasiswaan',
    to: '/kemahasiswaan',
    warna: 'icon-box-amber',
    ikon: Award,
  },
  {
    judul: 'Surat Akademik',
    deskripsi:
      'Surat keterangan aktif kuliah, surat bebas pustaka, dan cetak transkrip nilai elektronik.',
    tautan: 'Ajukan Surat Online',
    to: '/surat',
    warna: 'icon-box-purple',
    ikon: File,
  },
  {
    judul: 'Kalender Akademik',
    deskripsi:
      'Jadwal registrasi mahasiswa baru, batas pembayaran, tutorial online, dan masa ujian semester.',
    tautan: 'Lihat Jadwal Penting',
    to: '/panduan',
    warna: 'icon-box-green',
    ikon: Calendar,
  },
  {
    judul: 'FAQ',
    deskripsi:
      'Jawaban atas pertanyaan terbanyak seputar KRS, kendala login, sistem nilai, dan yudisium.',
    tautan: 'Cari Pertanyaan',
    to: '/faq',
    warna: 'icon-box-red',
    ikon: CircleHelp,
  },
]
</script>

<template>
  <section id="layanan" class="section bg-surface" aria-labelledby="services-heading">
    <div class="container">
      <div class="section-head">
        <p class="chip chip-primary">Layanan</p>
        <h2 id="services-heading" class="section-title mt-5">
          Semua urusan akademik, satu pintu
        </h2>
        <p class="section-lead">
          Pilih layanan yang Anda butuhkan — seluruhnya dapat diakses secara digital.
        </p>
      </div>

      <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <NuxtLink
          v-for="item in layanan"
          :key="item.judul"
          :to="item.to"
          class="card card-hover group flex h-full flex-col p-7"
        >
          <div class="icon-box group-hover:scale-110" :class="item.warna" aria-hidden="true">
            <component :is="item.ikon" :size="22" />
          </div>

          <h3 class="mt-6 text-[1.0625rem] font-bold">{{ item.judul }}</h3>

          <p class="mb-6 mt-2 flex-grow text-sm leading-relaxed">{{ item.deskripsi }}</p>

          <span class="flex items-center gap-1.5 text-sm font-bold text-primary">
            {{ item.tautan }}
            <ArrowRight :size="16" class="transition-transform duration-200 group-hover:translate-x-1" />
          </span>
        </NuxtLink>
      </div>
    </div>
  </section>
</template>
