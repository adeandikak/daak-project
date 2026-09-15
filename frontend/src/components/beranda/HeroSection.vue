<script setup lang="ts">
import { ArrowRight, CalendarDays } from 'lucide-vue-next'

/**
 * Hero bergaya Spike: latar terang dengan sapuan biru lembut, judul raksasa
 * rata tengah, dua tombol pil, lalu deretan chip angka sebagai penanda skala
 * (setara baris logo teknologi pada Spike).
 */
const sorotan = [
  '40+ UT Daerah',
  '4 Fakultas',
  '500+ Program Studi',
  'Terakreditasi Unggul',
]
</script>

<template>
  <section class="relative isolate overflow-hidden bg-grad-hero" aria-labelledby="hero-heading">
    <!-- Ornamen kuning samar khas identitas UT -->
    <div
      class="pointer-events-none absolute -left-40 top-24 -z-10 h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle,rgba(255,204,0,.16)_0%,transparent_65%)]"
      aria-hidden="true"
    />

    <div class="container pb-20 pt-16 text-center md:pb-28 md:pt-24">
      <div class="mx-auto max-w-[900px] animate-fade-up">
        <p class="chip chip-primary">
          <span class="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />
          Portal Resmi Universitas Terbuka
        </p>

        <h1 id="hero-heading" class="mt-7 font-display text-hero font-extrabold text-ink">
          Layanan pusat administrasi
          <span class="text-primary">akademik &amp; kemahasiswaan</span>
        </h1>

        <p class="section-lead mx-auto mt-6 max-w-[620px]">
          Satu pintu untuk registrasi, kelulusan, kemahasiswaan, dan seluruh
          informasi akademik bagi mahasiswa serta sivitas akademika UT.
        </p>

        <div class="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a href="#layanan" class="btn btn-primary btn-lg">
            Jelajahi Layanan
            <ArrowRight :size="18" />
          </a>

          <NuxtLink to="/panduan" class="btn btn-outline btn-lg">
            <CalendarDays :size="18" />
            Kalender Akademik
          </NuxtLink>
        </div>

        <!-- Deretan chip angka di dalam satu pil putih -->
        <div class="mt-12 flex justify-center">
          <ul
            class="flex flex-wrap items-center justify-center gap-x-2 gap-y-2 rounded-full border border-line bg-surface/80 px-3 py-2 shadow-card backdrop-blur"
          >
            <li
              v-for="item in sorotan"
              :key="item"
              class="rounded-full px-3 py-1 text-[.8125rem] font-semibold text-ink-muted"
            >
              {{ item }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>
