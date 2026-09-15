<script setup lang="ts">
import { ArrowRight, Check } from 'lucide-vue-next'

/** Empat kartu panduan bergaya Spike: nomor langkah sebagai chip, poin bercentang. */
const langkah = [
  {
    nomor: '01',
    judul: 'Cara Registrasi',
    poin: [
      'Masuk ke SIA UT Portal',
      'Pilih menu registrasi matakuliah',
      'Pilih paket studi semester',
      'Validasi dan simpan billing',
    ],
  },
  {
    nomor: '02',
    judul: 'Cara Pembayaran',
    poin: [
      'Gunakan nomor Billing Anda',
      'Bayar via Bank Mitra (BRI/Mandiri)',
      'Bisa M-banking atau teller',
      'Simpan bukti transaksi sah',
    ],
  },
  {
    nomor: '03',
    judul: 'Cara Wisuda',
    poin: [
      'Pastikan status yudisium disetujui',
      'Unggah pasfoto wisuda standar',
      'Konfirmasi pilihan kehadiran',
      'Unduh undangan digital QR',
    ],
  },
  {
    nomor: '04',
    judul: 'Cara Cetak Transkrip',
    poin: [
      'Ajukan via Surat Akademik',
      'Isi data NIM secara lengkap',
      'Tunggu tanda tangan pejabat',
      'Unduh PDF berstempel QR',
    ],
  },
]
</script>

<template>
  <section class="section bg-surface" aria-labelledby="guides-heading">
    <div class="container">
      <div class="section-head">
        <p class="chip chip-primary">Panduan</p>
        <h2 id="guides-heading" class="section-title mt-5">Empat langkah, selesai</h2>
        <p class="section-lead">
          Ikuti panduan praktis berikut agar administrasi studi Anda berjalan lancar.
        </p>
      </div>

      <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <article
          v-for="item in langkah"
          :key="item.nomor"
          class="card card-hover flex h-full flex-col p-7"
        >
          <span
            class="flex h-11 w-11 items-center justify-center rounded-xl bg-primary font-display text-base font-extrabold text-accent"
            aria-hidden="true"
          >
            {{ item.nomor }}
          </span>

          <h3 class="mt-6 text-[1.0625rem] font-bold">{{ item.judul }}</h3>

          <ul class="m-0 mb-7 mt-4 flex flex-grow list-none flex-col gap-3 p-0 text-sm">
            <li
              v-for="poin in item.poin"
              :key="poin"
              class="flex items-start gap-2.5 leading-relaxed text-ink-muted"
            >
              <span
                class="mt-0.5 flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full bg-primary/[.08] text-primary"
                aria-hidden="true"
              >
                <Check :size="11" :stroke-width="3" />
              </span>
              {{ poin }}
            </li>
          </ul>

          <NuxtLink to="/panduan" class="btn btn-ghost btn-sm w-full">
            Baca Selengkapnya
            <ArrowRight :size="15" />
          </NuxtLink>
        </article>
      </div>
    </div>
  </section>
</template>
