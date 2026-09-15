<script setup lang="ts">
import { ArrowRight, Menu, X } from 'lucide-vue-next'

import { useNavigasiStore } from '~/stores/navigasi'

/**
 * Navigasi sticky bergaya Spike: latar putih, menu di tengah, item aktif
 * ditandai chip biru lembut, dan CTA berbentuk pil kuning di kanan.
 */
const nav = useNavigasiStore()
const { drawerTerbuka } = storeToRefs(nav)

const route = useRoute()
watch(() => route.fullPath, () => nav.tutupDrawer())

const aktif = (to: string) => nav.cocok(to, route.path)

// Garis bawah tipis baru muncul setelah halaman digulir — sama seperti Spike
const tergulir = ref(false)
const onScroll = () => (tergulir.value = window.scrollY > 4)

onMounted(() => {
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
})
onBeforeUnmount(() => window.removeEventListener('scroll', onScroll))
</script>

<template>
  <nav
    class="sticky top-0 z-[90] border-b bg-surface/90 backdrop-blur transition-colors duration-200"
    :class="tergulir ? 'border-line' : 'border-transparent'"
  >
    <div class="container flex h-[60px] items-center gap-4">
      <!-- Menu desktop, rata tengah -->
      <ul class="hidden flex-1 list-none items-center justify-center gap-1 p-0 lg:flex">
        <li v-for="menu in nav.menus" :key="menu.to">
          <NuxtLink
            :to="menu.to"
            class="block whitespace-nowrap rounded-full px-4 py-2 text-[.9375rem] transition-colors duration-200"
            :class="
              aktif(menu.to)
                ? 'bg-primary/[.07] font-bold text-primary'
                : 'font-medium text-ink-muted hover:bg-canvas hover:text-primary'
            "
          >
            {{ menu.label }}
          </NuxtLink>
        </li>
      </ul>

      <!-- CTA aksen -->
      <NuxtLink to="/registrasi" class="btn btn-accent btn-sm ml-auto max-lg:hidden">
        Akses Layanan
        <ArrowRight :size="16" />
      </NuxtLink>

      <!-- Burger mobile -->
      <button
        type="button"
        class="ml-auto flex items-center justify-center rounded-full p-2 text-primary hover:bg-canvas lg:hidden"
        aria-label="Toggle menu navigasi"
        :aria-expanded="drawerTerbuka"
        aria-controls="drawer-menu"
        @click="nav.toggleDrawer()"
      >
        <component :is="drawerTerbuka ? X : Menu" :size="22" :stroke-width="2.25" />
      </button>
    </div>

    <!-- Drawer mobile -->
    <ul
      v-show="drawerTerbuka"
      id="drawer-menu"
      class="m-0 flex list-none flex-col gap-1 border-t border-line bg-surface p-4 lg:hidden"
    >
      <li v-for="menu in nav.menus" :key="menu.to">
        <NuxtLink
          :to="menu.to"
          class="block rounded-xl px-4 py-3 text-[.9375rem] transition-colors"
          :class="
            aktif(menu.to)
              ? 'bg-primary/[.07] font-bold text-primary'
              : 'font-medium text-ink-muted hover:bg-canvas'
          "
        >
          {{ menu.label }}
        </NuxtLink>
      </li>

      <li class="mt-2">
        <NuxtLink to="/registrasi" class="btn btn-accent btn-sm w-full">
          Akses Layanan
          <ArrowRight :size="16" />
        </NuxtLink>
      </li>
    </ul>
  </nav>
</template>
