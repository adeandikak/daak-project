<script setup lang="ts">
/**
 * Batang vertikal sederhana; tinggi dinormalkan terhadap nilai terbesar.
 *
 * Tinggi dihitung dalam PIKSEL, bukan persen. Persen memerlukan induk dengan
 * tinggi pasti, sedangkan batang ini berada di dalam kolom flex yang tingginya
 * mengikuti isi — akibatnya persen resolve ke nol dan batangnya tak terlihat.
 */
const props = withDefaults(
  defineProps<{
    data: { label: string; nilai: number }[]
    warna?: string
    tinggiMaks?: number
  }>(),
  { warna: '#0A4C85', tinggiMaks: 130 },
)

const maks = computed(() => Math.max(1, ...props.data.map((d) => d.nilai)))

/** Minimal 8px supaya nilai kecil tetap terlihat sebagai batang, bukan garis. */
const tinggi = (n: number) => `${Math.max(8, Math.round((n / maks.value) * props.tinggiMaks))}px`
</script>

<template>
  <div>
    <div class="flex gap-3" :style="{ height: `${tinggiMaks + 28}px` }">
      <div
        v-for="d in data"
        :key="d.label"
        class="flex min-w-0 flex-1 flex-col items-center justify-end gap-2"
      >
        <span class="text-xs font-semibold text-ink">{{ d.nilai }}</span>

        <div
          class="w-full rounded-t-lg transition-[height] duration-500"
          :style="{ height: tinggi(d.nilai), backgroundColor: warna }"
          role="img"
          :aria-label="`${d.label}: ${d.nilai}`"
        />
      </div>
    </div>

    <div class="mt-3 flex gap-3 border-t border-line pt-3">
      <span
        v-for="d in data"
        :key="d.label"
        class="min-w-0 flex-1 truncate text-center text-xs text-ink-light"
        :title="d.label"
      >
        {{ d.label }}
      </span>
    </div>
  </div>
</template>
