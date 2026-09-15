<script setup lang="ts">
import { statistikService } from '~/services/statistik.service'
import type { Statistik } from '~/types'

/**
 * Angka ringkas UT dalam satu kartu membulat berlatar biru tua — mengikuti
 * bentuk pita gelap Spike, memakai warna UT.
 *
 * Angka final sudah ter-render saat SSR (baik untuk SEO dan pengguna tanpa JS);
 * animasi hitung baru dimulai di klien ketika blok masuk viewport.
 */
const { data } = await useAsyncData('beranda:statistik', () => statistikService.list())

/** Cadangan statis agar blok tetap tampil bila API belum siap. */
const cadangan: Statistik[] = [
  { id: 1, label: 'UT Daerah', nilai: 40, suffix: '+', urutan: 1 },
  { id: 2, label: 'Fakultas', nilai: 4, suffix: null, urutan: 2 },
  { id: 3, label: 'Mahasiswa Baru', nilai: 40000, suffix: '+', urutan: 3 },
  { id: 4, label: 'Program Studi', nilai: 500, suffix: '+', urutan: 4 },
]

const statistik = computed<Statistik[]>(() =>
  data.value?.data?.length ? data.value.data : cadangan,
)

const root = ref<HTMLElement | null>(null)
const tampil = ref<number[]>(statistik.value.map((s) => s.nilai))

const formatAngka = (n: number) => new Intl.NumberFormat('id-ID').format(Math.round(n))

const jalankanAnimasi = () => {
  statistik.value.forEach((item, index) => {
    const durasi = 1400
    const mulai = performance.now()

    const step = (now: number) => {
      const progress = Math.min((now - mulai) / durasi, 1)
      tampil.value[index] = item.nilai * (1 - Math.pow(1 - progress, 4))
      if (progress < 1) requestAnimationFrame(step)
    }

    requestAnimationFrame(step)
  })
}

onMounted(() => {
  const kurangiGerak = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  if (kurangiGerak || !root.value || typeof IntersectionObserver === 'undefined') {
    return // biarkan angka final apa adanya
  }

  const observer = new IntersectionObserver(
    ([entry]) => {
      if (!entry.isIntersecting) return
      tampil.value = statistik.value.map(() => 0) // mulai dari nol lalu naik
      jalankanAnimasi()
      observer.disconnect()
    },
    { threshold: 0.35 },
  )

  observer.observe(root.value)
  onBeforeUnmount(() => observer.disconnect())
})
</script>

<template>
  <section ref="root" class="bg-surface pb-4 pt-8" aria-labelledby="stats-heading">
    <h2 id="stats-heading" class="sr-only">Universitas Terbuka dalam angka</h2>

    <div class="container">
      <div class="cta-band">
        <!-- Ornamen agar bidang biru tidak terasa datar -->
        <div class="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-white/[.06]" aria-hidden="true" />
        <div class="pointer-events-none absolute -bottom-28 -left-16 h-72 w-72 rounded-full bg-accent/10" aria-hidden="true" />

        <dl class="relative grid grid-cols-2 gap-x-6 gap-y-10 text-center lg:grid-cols-4">
          <div
            v-for="(item, index) in statistik"
            :key="item.id"
            class="lg:[&+&]:border-l lg:[&+&]:border-white/10"
          >
            <dd
              class="mb-2 font-display text-stat font-extrabold tracking-[-0.02em] text-accent [font-variant-numeric:tabular-nums]"
            >
              {{ formatAngka(tampil[index] ?? item.nilai) }}{{ item.suffix ?? '' }}
            </dd>
            <dt class="text-[.875rem] font-medium text-secondary-light">
              {{ item.label }}
            </dt>
          </div>
        </dl>
      </div>
    </div>
  </section>
</template>
