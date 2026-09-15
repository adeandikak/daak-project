<script setup lang="ts">
import { ArrowRight } from 'lucide-vue-next'

import { beritaService } from '~/services/berita.service'
import { ikon } from '~/utils/icons'
import { pesanGalat } from '~/utils/error.handler'
import type { Berita } from '~/types'

/** Grid tiga kolom berita terbaru. */
const { data, pending, error } = await useAsyncData(
  'beranda:berita',
  () => beritaService.list({ limit: 3 }),
)

const daftar = computed<Berita[]>(() => data.value?.data ?? [])

const { formatTanggal } = useFormatTanggal()
</script>

<template>
  <section class="section bg-canvas" aria-labelledby="news-heading">
    <div class="container">
      <div class="section-head">
        <p class="chip chip-primary">Kabar Terkini</p>
        <h2 id="news-heading" class="section-title mt-5">Berita terbaru</h2>
        <p class="section-lead">
          Peristiwa, prestasi, dan aktivitas akademik terbaru di lingkungan Universitas Terbuka.
        </p>
      </div>

      <div v-if="pending" class="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div v-for="n in 3" :key="n" class="skeleton h-[380px]" />
      </div>

      <p v-else-if="error" class="alert-danger mx-auto max-w-[560px]">
        {{ pesanGalat(error, 'Gagal memuat berita terbaru.') }}
      </p>

      <div v-else class="grid grid-cols-1 gap-6 md:grid-cols-3">
        <article
          v-for="berita in daftar"
          :key="berita.id"
          class="card card-hover group flex h-full flex-col overflow-hidden"
        >
          <!-- Thumbnail: gradien + ikon, diberi bantalan seperti kartu demo Spike -->
          <div class="p-3 pb-0">
            <div class="relative aspect-[16/10] overflow-hidden rounded-lg">
              <div
                class="flex h-full w-full items-center justify-center transition-transform duration-500 group-hover:scale-105"
                :style="{
                  background: `linear-gradient(135deg, ${berita.gradient_from}, ${berita.gradient_to})`,
                }"
              >
                <component
                  :is="ikon(berita.ikon)"
                  :size="44"
                  :stroke-width="1.5"
                  color="rgba(255,255,255,0.45)"
                />
              </div>

              <span
                class="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-[.6875rem] font-bold uppercase tracking-wide text-primary backdrop-blur"
              >
                {{ berita.kategori }}
              </span>
            </div>
          </div>

          <div class="flex flex-grow flex-col p-6">
            <div class="text-xs font-medium text-ink-light">
              {{ formatTanggal(berita.tanggal) }}
            </div>

            <h3 class="mb-3 mt-2 line-clamp-2 text-[1.0625rem] font-bold leading-snug">
              {{ berita.judul }}
            </h3>

            <p class="mb-6 line-clamp-3 flex-grow text-sm leading-relaxed">
              {{ berita.ringkasan }}
            </p>

            <NuxtLink
              :to="berita.tautan_url"
              class="flex items-center gap-1.5 text-sm font-bold text-primary"
            >
              Baca Selengkapnya
              <ArrowRight :size="16" class="transition-transform duration-200 group-hover:translate-x-1" />
            </NuxtLink>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>
