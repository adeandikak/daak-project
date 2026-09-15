<script setup lang="ts">
import { ArrowUpRight, Gauge, Megaphone, Newspaper } from 'lucide-vue-next'

import { dasborService, type RingkasanDasbor } from '~/services/dasbor.service'
import { useAuthStore } from '~/stores/auth'
import { pesanGalat } from '~/utils/error.handler'

/**
 * Dasbor staf DAAK. Seluruh angka berasal dari /api/v1/dasbor/ringkasan yang
 * dipagari AuthGuard di server — menyembunyikan menu di klien saja tidak cukup.
 */
definePageMeta({ layout: 'dasbor', middleware: 'auth' })

useHead({ title: 'Dasbor — DAAK Universitas Terbuka' })

const auth = useAuthStore()
const { formatTanggal } = useFormatTanggal()

const { data, pending, error } = await useAsyncData('dasbor:ringkasan', () =>
  dasborService.ringkasan(),
)

const r = computed<RingkasanDasbor | null>(() => data.value?.data ?? null)

const WARNA_STATUS: Record<string, string> = {
  penting: '#D35044',
  baru: '#0A4C85',
  update: '#E8A317',
}

const KELAS_BADGE: Record<string, string> = {
  penting: 'badge-penting',
  baru: 'badge-baru',
  update: 'badge-update',
}

const donatStatus = computed(() =>
  (r.value?.pengumuman_per_status ?? []).map((d) => ({
    label: d.status,
    nilai: d.jumlah,
    warna: WARNA_STATUS[d.status] ?? '#8A97AC',
  })),
)

const batangKategori = computed(() =>
  (r.value?.berita_per_kategori ?? []).map((d) => ({ label: d.kategori, nilai: d.jumlah })),
)

const formatAngka = (n: number) => new Intl.NumberFormat('id-ID').format(n)

const salamWaktu = computed(() => {
  const jam = new Date().getHours()
  if (jam < 11) return 'Selamat pagi'
  if (jam < 15) return 'Selamat siang'
  if (jam < 19) return 'Selamat sore'
  return 'Selamat malam'
})
</script>

<template>
  <div>
    <!-- ── Sambutan ── -->
    <section class="card relative overflow-hidden p-7 sm:p-9">
      <div class="relative z-10 max-w-[560px]">
        <p class="chip chip-primary">Dasbor Staf</p>

        <h1 class="mt-4 font-display text-[1.625rem] font-extrabold leading-tight">
          {{ salamWaktu }}, {{ auth.staf?.nama ?? 'Staf DAAK' }}
        </h1>

        <p class="mt-2 text-sm">
          {{ auth.staf?.jabatan ?? 'Direktorat Administrasi Akademik dan Kemahasiswaan' }} —
          berikut ringkasan konten portal hari ini.
        </p>

        <NuxtLink to="/" class="btn btn-primary btn-sm mt-6">
          Lihat Portal Publik
          <ArrowUpRight :size="16" />
        </NuxtLink>
      </div>

      <img
        src="/images/hero-illustration.jpg"
        alt=""
        aria-hidden="true"
        class="pointer-events-none absolute -bottom-8 right-0 hidden w-[260px] rounded-2xl opacity-90 lg:block"
      >
    </section>

    <!-- ── Menunggu / galat ── -->
    <div v-if="pending" class="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-3">
      <div v-for="n in 3" :key="n" class="skeleton h-[124px]" />
    </div>

    <p v-else-if="error" class="alert-danger mt-6">
      {{ pesanGalat(error, 'Gagal memuat ringkasan dasbor.') }}
    </p>

    <template v-else-if="r">
      <!-- ── Kartu angka ── -->
      <section class="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-3">
        <KartuAngka
          label="Pengumuman Terbit"
          :nilai="r.kartu.pengumuman"
          keterangan="Tampil di accordion Beranda"
          :ikon="Megaphone"
          warna="icon-box-blue"
        />
        <KartuAngka
          label="Berita Terbit"
          :nilai="r.kartu.berita"
          keterangan="Tiga terbaru tampil di Beranda"
          :ikon="Newspaper"
          warna="icon-box-sky"
        />
        <KartuAngka
          label="Angka Statistik"
          :nilai="r.kartu.statistik"
          keterangan="Blok counter Beranda"
          :ikon="Gauge"
          warna="icon-box-amber"
        />
      </section>

      <!-- ── Sebaran ── -->
      <section class="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div class="card p-7">
          <h2 class="mb-1 text-[1.0625rem] font-bold">Pengumuman per Status</h2>
          <p class="mb-6 text-[.8125rem]">Sebaran badge yang tampil di Beranda.</p>

          <GrafikDonat v-if="donatStatus.length" :data="donatStatus" />
          <p v-else class="mb-0 text-sm text-ink-light">Belum ada pengumuman terbit.</p>
        </div>

        <div class="card p-7">
          <h2 class="mb-1 text-[1.0625rem] font-bold">Berita per Kategori</h2>
          <p class="mb-6 text-[.8125rem]">Jumlah artikel terbit pada tiap kategori.</p>

          <GrafikBatang v-if="batangKategori.length" :data="batangKategori" />
          <p v-else class="mb-0 text-sm text-ink-light">Belum ada berita terbit.</p>
        </div>
      </section>

      <!-- ── Statistik UT ── -->
      <section class="card mt-6 p-7">
        <h2 class="mb-1 text-[1.0625rem] font-bold">Statistik Universitas Terbuka</h2>
        <p class="mb-6 text-[.8125rem]">Angka yang tampil pada blok counter Beranda.</p>

        <dl class="m-0 grid grid-cols-2 gap-6 lg:grid-cols-4">
          <div v-for="s in r.statistik" :key="s.id" class="rounded-xl bg-canvas p-5">
            <dd class="mb-0 font-display text-[1.75rem] font-extrabold leading-none text-primary">
              {{ formatAngka(s.nilai) }}{{ s.suffix ?? '' }}
            </dd>
            <dt class="mt-2 text-[.8125rem] text-ink-muted">{{ s.label }}</dt>
          </div>
        </dl>
      </section>

      <!-- ── Tabel terbaru ── -->
      <section class="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <!-- Pengumuman -->
        <div class="card overflow-hidden">
          <div class="border-b border-line px-7 py-5">
            <h2 class="mb-0 text-[1.0625rem] font-bold">Pengumuman Terbaru</h2>
          </div>

          <table class="w-full text-left text-sm">
            <thead>
              <tr class="border-b border-line text-xs uppercase tracking-wide text-ink-light">
                <th scope="col" class="px-7 py-3 font-semibold">Judul</th>
                <th scope="col" class="py-3 pr-7 text-right font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="p in r.terbaru.pengumuman"
                :key="p.id"
                class="border-b border-line-subtle last:border-b-0"
              >
                <td class="px-7 py-4">
                  <span class="block font-semibold text-ink">{{ p.judul }}</span>
                  <span class="mt-0.5 block text-xs text-ink-light">
                    {{ formatTanggal(p.tanggal) }}
                  </span>
                </td>
                <td class="py-4 pr-7 text-right align-top">
                  <span class="badge" :class="KELAS_BADGE[p.status]">{{ p.status }}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Berita -->
        <div class="card overflow-hidden">
          <div class="border-b border-line px-7 py-5">
            <h2 class="mb-0 text-[1.0625rem] font-bold">Berita Terbaru</h2>
          </div>

          <table class="w-full text-left text-sm">
            <thead>
              <tr class="border-b border-line text-xs uppercase tracking-wide text-ink-light">
                <th scope="col" class="px-7 py-3 font-semibold">Judul</th>
                <th scope="col" class="py-3 pr-7 text-right font-semibold">Kategori</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="b in r.terbaru.berita"
                :key="b.id"
                class="border-b border-line-subtle last:border-b-0"
              >
                <td class="px-7 py-4">
                  <span class="block font-semibold text-ink">{{ b.judul }}</span>
                  <span class="mt-0.5 block text-xs text-ink-light">
                    {{ formatTanggal(b.tanggal) }}
                  </span>
                </td>
                <td class="py-4 pr-7 text-right align-top">
                  <span class="chip chip-primary">{{ b.kategori }}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </template>
  </div>
</template>
