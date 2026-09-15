<script setup lang="ts">
import type { Component } from 'vue'

/** Kartu angka ringkas: ikon pastel, label, nilai besar, keterangan kecil. */
defineProps<{
  label: string
  nilai: number | string
  keterangan?: string
  ikon: Component
  warna: string
}>()
</script>

<template>
  <div class="card p-6">
    <div class="flex items-start justify-between gap-4">
      <div class="min-w-0">
        <p class="mb-0 text-[.8125rem] font-medium text-ink-muted">{{ label }}</p>
        <p class="mb-0 mt-2 font-display text-[2rem] font-extrabold leading-none text-ink">
          {{ nilai }}
        </p>
        <p v-if="keterangan" class="mb-0 mt-2 text-xs text-ink-light">{{ keterangan }}</p>
      </div>

      <span class="icon-box flex-shrink-0" :class="warna" aria-hidden="true">
        <component :is="ikon" :size="22" />
      </span>
    </div>
  </div>
</template>
