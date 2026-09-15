<script setup lang="ts">
/**
 * Beranda portal DAAK UT.
 * Susunan section mengikuti alur landing page Spike:
 * Hero -> Layanan -> Pengumuman -> Statistik -> Panduan -> Berita -> CTA bantuan.
 *
 * Komponen di-auto-import tanpa awalan folder (components.pathPrefix = false),
 * jadi HeroSection.vue dipanggil sebagai <HeroSection />.
 */
definePageMeta({ layout: 'default' })
</script>

<template>
  <div>
    <HeroSection />
    <LayananAksesCepat />
    <PengumumanPenting />
    <StatistikRingkas />
    <PanduanLangkah />
    <BeritaTerbaru />
    <BantuanCta />
  </div>
</template>
