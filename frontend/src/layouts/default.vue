<script setup lang="ts">
/**
 * Susunan halaman publik mengikuti design system DAAK:
 * accent bar -> top bar -> header nav (sticky) -> konten -> footer.
 */
</script>

<template>
  <div>
    <a
      href="#main-portal-content"
      class="absolute -left-[9999px] top-0 z-[200] focus:left-4 focus:top-4 focus:rounded-sm focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
    >
      Lompat ke konten utama
    </a>

    <!-- Garis aksen identitas UT -->
    <div class="h-1 w-full bg-accent" aria-hidden="true" />

    <AppTopBar />
    <AppNavbar />

    <main id="main-portal-content" tabindex="-1">
      <slot />
    </main>

    <AppFooter />
  </div>
</template>
