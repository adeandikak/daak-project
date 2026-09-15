<script setup lang="ts">
/**
 * Donat proporsi. Digambar langsung sebagai SVG, bukan lewat pustaka grafik:
 * kebutuhannya hanya donat dan batang sederhana, sedangkan ApexCharts yang
 * dipakai template menambah ratusan kilobyte untuk hal yang muat dalam
 * beberapa baris stroke-dasharray.
 */
const props = withDefaults(
  defineProps<{
    data: { label: string; nilai: number; warna: string }[]
    ukuran?: number
    tebal?: number
  }>(),
  { ukuran: 148, tebal: 18 },
)

const radius = computed(() => (props.ukuran - props.tebal) / 2)
const keliling = computed(() => 2 * Math.PI * radius.value)
const total = computed(() => props.data.reduce((a, b) => a + b.nilai, 0))

/** Potongan busur beserta offset kumulatifnya. */
const potongan = computed(() => {
  if (!total.value) return []

  let jalan = 0

  return props.data.map((d) => {
    const porsi = d.nilai / total.value
    const panjang = porsi * keliling.value
    const offset = -jalan * keliling.value
    jalan += porsi

    return {
      ...d,
      persen: Math.round(porsi * 100),
      dasharray: `${panjang} ${keliling.value - panjang}`,
      dashoffset: offset,
    }
  })
})
</script>

<template>
  <div class="flex items-center gap-6">
    <svg
      :width="ukuran"
      :height="ukuran"
      :viewBox="`0 0 ${ukuran} ${ukuran}`"
      class="flex-shrink-0 -rotate-90"
      role="img"
      :aria-label="`Diagram donat: ${data.map((d) => `${d.label} ${d.nilai}`).join(', ')}`"
    >
      <circle
        :cx="ukuran / 2"
        :cy="ukuran / 2"
        :r="radius"
        fill="none"
        stroke="#EFF3F9"
        :stroke-width="tebal"
      />

      <circle
        v-for="p in potongan"
        :key="p.label"
        :cx="ukuran / 2"
        :cy="ukuran / 2"
        :r="radius"
        fill="none"
        :stroke="p.warna"
        :stroke-width="tebal"
        :stroke-dasharray="p.dasharray"
        :stroke-dashoffset="p.dashoffset"
        stroke-linecap="butt"
      />
    </svg>

    <ul class="m-0 flex min-w-0 flex-1 list-none flex-col gap-3 p-0">
      <li v-for="p in potongan" :key="p.label" class="flex items-center gap-2.5 text-sm">
        <span
          class="h-2.5 w-2.5 flex-shrink-0 rounded-full"
          :style="{ backgroundColor: p.warna }"
          aria-hidden="true"
        />
        <span class="min-w-0 flex-1 truncate capitalize text-ink-muted">{{ p.label }}</span>
        <span class="flex-shrink-0 font-semibold text-ink">{{ p.nilai }}</span>
        <span class="w-10 flex-shrink-0 text-right text-xs text-ink-light">{{ p.persen }}%</span>
      </li>
    </ul>
  </div>
</template>
