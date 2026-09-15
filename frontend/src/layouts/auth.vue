<script setup lang="ts">
import { Award, ShieldCheck, Users } from 'lucide-vue-next'

/**
 * Layout autentikasi dua panel:
 * kiri = panel merek biru tua (hanya tampil mulai lg), kanan = formulir.
 *
 * Panel kiri sengaja diletakkan di layout, bukan di halaman, supaya halaman
 * lain seperti lupa-sandi dapat memakainya kembali tanpa menyalin markup.
 */
const sorotan = [
  { label: 'Jangkauan Layanan', nilai: '40+ UT Daerah', ikon: Users },
  { label: 'Akreditasi Institusi', nilai: 'Unggul — BAN-PT', ikon: Award },
  { label: 'Koneksi Aman', nilai: 'Terenkripsi & Terlindungi', ikon: ShieldCheck },
]
</script>

<template>
  <div class="flex min-h-screen bg-surface">
    <!-- ── Panel kiri: merek ── -->
    <aside
      class="relative hidden w-[56%] flex-col justify-between overflow-hidden bg-primary p-12 xl:p-16 lg:flex"
    >
      <!-- Sapuan gradien agar bidang biru tidak rata -->
      <div
        class="pointer-events-none absolute inset-0 bg-[radial-gradient(900px_600px_at_75%_18%,rgba(59,130,246,.22)_0%,transparent_60%),radial-gradient(700px_500px_at_10%_85%,rgba(0,0,0,.28)_0%,transparent_65%)]"
        aria-hidden="true"
      />
      <div
        class="pointer-events-none absolute -left-32 bottom-10 h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle,rgba(255,204,0,.10)_0%,transparent_65%)]"
        aria-hidden="true"
      />

      <!-- Identitas -->
      <NuxtLink to="/" class="relative flex items-center" aria-label="Beranda DAAK Universitas Terbuka">
        <img
          src="/images/logo-daak.png"
          alt="Logo DAAK"
          class="h-10 w-auto brightness-0 invert"
        >
        <span class="mx-5 h-10 w-px bg-white/25" aria-hidden="true" />
        <span class="leading-tight">
          <span class="block font-display text-[.9375rem] font-bold text-white">
            Direktorat Administrasi Akademik dan Kemahasiswaan
          </span>
          <span class="mt-0.5 block text-[.6875rem] font-medium uppercase tracking-[.16em] text-white/60">
            Universitas Terbuka
          </span>
        </span>
      </NuxtLink>

      <!-- Sambutan -->
      <div class="relative max-w-[520px]">
        <h2 class="font-display text-[clamp(2rem,1.2rem+1.9vw,3rem)] font-extrabold leading-[1.12] text-white">
          Selamat datang di<br>
          Portal <span class="text-accent">DAAK UT</span>
        </h2>

        <p class="mt-6 text-[1.0625rem] leading-relaxed text-secondary-light">
          Kelola layanan akademik Anda — registrasi mata kuliah, pengajuan
          transkrip, kelulusan, hingga informasi beasiswa — dalam satu
          platform terpadu.
        </p>
      </div>

      <!-- Kartu sorotan -->
      <ul class="relative m-0 flex list-none flex-col gap-3 p-0">
        <li
          v-for="item in sorotan"
          :key="item.label"
          class="flex items-center gap-4 rounded-xl border border-white/10 bg-white/[.06] px-5 py-4 backdrop-blur-sm"
        >
          <span
            class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-white/10 text-accent"
            aria-hidden="true"
          >
            <component :is="item.ikon" :size="18" />
          </span>

          <span class="leading-tight">
            <span class="block text-[.8125rem] text-white/60">{{ item.label }}</span>
            <span class="mt-0.5 block text-[.9375rem] font-bold text-white">{{ item.nilai }}</span>
          </span>
        </li>
      </ul>
    </aside>

    <!-- ── Panel kanan: formulir ── -->
    <main class="flex flex-1 flex-col items-center justify-center px-6 py-10 sm:px-10">
      <div class="w-full max-w-[420px]">
        <slot />
      </div>
    </main>
  </div>
</template>
