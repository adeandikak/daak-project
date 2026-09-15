<script setup lang="ts">
import { ChevronDown } from 'lucide-vue-next'

import { pengumumanService } from '~/services/pengumuman.service'
import { pesanGalat } from '~/utils/error.handler'
import type { Pengumuman } from '~/types'

/* useAsyncData membungkus service supaya pengambilan data ikut terjadi saat
   SSR dan hasilnya tidak diambil ulang di klien. Komponen tidak menyentuh
   axios langsung — selalu lewat service. */
const { data, pending, error } = await useAsyncData(
  'beranda:pengumuman',
  () => pengumumanService.list({ limit: 3 }),
)

const daftar = computed<Pengumuman[]>(() => data.value?.data ?? [])

const aktif = ref<number | null>(null)
const toggle = (id: number) => (aktif.value = aktif.value === id ? null : id)

/* Nama kelas ditulis LENGKAP, bukan dirangkai `badge-${status}`.
   Tailwind memindai kode sebagai teks: kelas yang baru terbentuk saat runtime
   tidak terlihat olehnya dan dibuang saat build. `safelist` tidak menolong
   untuk kelas @layer components — hanya untuk utility bawaan Tailwind. */
const KELAS_BADGE: Record<string, string> = {
  penting: 'badge-penting',
  baru: 'badge-baru',
  update: 'badge-update',
}

const { formatTanggal } = useFormatTanggal()
</script>

<template>
  <section class="section bg-canvas" aria-labelledby="announcements-heading">
    <div class="container">
      <div class="section-head">
        <p class="chip chip-accent">Informasi Resmi</p>
        <h2 id="announcements-heading" class="section-title mt-5">Pengumuman penting</h2>
        <p class="section-lead">
          Kabar resmi terbaru seputar jadwal akademik krusial Universitas Terbuka.
        </p>
      </div>

      <div class="mx-auto max-w-[880px]">
        <!-- Menunggu data -->
        <div v-if="pending" class="flex flex-col gap-4">
          <div v-for="n in 3" :key="n" class="skeleton h-[86px]" />
        </div>

        <!-- Galat -->
        <p v-else-if="error" class="alert-danger">
          {{ pesanGalat(error, 'Gagal memuat pengumuman. Silakan muat ulang halaman.') }}
        </p>

        <!-- Kosong -->
        <p v-else-if="!daftar.length" class="text-center text-sm text-ink-muted">
          Belum ada pengumuman untuk saat ini.
        </p>

        <!-- Daftar: panel expansion bergaya FAQ Spike -->
        <div v-else class="flex flex-col gap-4">
          <div
            v-for="item in daftar"
            :key="item.id"
            class="overflow-hidden rounded-xl border bg-surface transition-[border-color,box-shadow] duration-300"
            :class="aktif === item.id ? 'border-primary/30 shadow-hover' : 'border-line hover:border-primary/20'"
          >
            <button
              type="button"
              class="flex w-full items-center gap-4 px-6 py-5 text-left"
              :aria-expanded="aktif === item.id"
              :aria-controls="`panel-${item.id}`"
              @click="toggle(item.id)"
            >
              <span class="flex min-w-0 flex-grow flex-col gap-2">
                <span class="flex items-center gap-3">
                  <span class="badge" :class="KELAS_BADGE[item.status]">{{ item.status }}</span>
                  <span class="text-[.8125rem] font-medium text-ink-light">
                    {{ formatTanggal(item.tanggal) }}
                  </span>
                </span>

                <span class="text-[1.0625rem] font-bold leading-snug text-ink">
                  {{ item.judul }}
                </span>
              </span>

              <span
                class="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full transition-all duration-300"
                :class="aktif === item.id ? 'rotate-180 bg-primary text-white' : 'bg-canvas text-ink-muted'"
              >
                <ChevronDown :size="18" :stroke-width="2.5" />
              </span>
            </button>

            <div
              v-show="aktif === item.id"
              :id="`panel-${item.id}`"
              class="border-t border-line px-6 pb-6 pt-5"
            >
              <p class="mb-5 text-[.9375rem] leading-relaxed">{{ item.isi }}</p>

              <NuxtLink
                v-if="item.cta_label && item.cta_url"
                :to="item.cta_url"
                class="btn btn-primary btn-sm"
              >
                {{ item.cta_label }}
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
