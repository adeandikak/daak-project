<script setup lang="ts">
import {
  Bell,
  ChevronDown,
  Files,
  Gauge,
  Globe,
  LayoutDashboard,
  LogOut,
  Megaphone,
  Menu,
  Newspaper,
  Search,
  Settings,
  Users,
} from 'lucide-vue-next'

import { useAuthStore } from '~/stores/auth'

/**
 * Cangkang area staf: sidebar kiri + topbar, mengikuti tata letak dasbor Spike.
 *
 * Menu yang halamannya BELUM ada sengaja dirender sebagai teks mati berlabel
 * "Segera", bukan tautan. Tautan yang mengarah ke halaman tak wujud hanya
 * menghasilkan layar kosong dan peringatan router.
 */
const auth = useAuthStore()
const route = useRoute()

const sidebarTerbuka = ref(false)
const menuAkunTerbuka = ref(false)

const grup = [
  {
    judul: 'Beranda',
    item: [
      { label: 'Dasbor', ikon: LayoutDashboard, to: '/dasbor' },
    ],
  },
  {
    judul: 'Konten',
    item: [
      { label: 'Pengumuman', ikon: Megaphone, to: null },
      { label: 'Berita', ikon: Newspaper, to: null },
      { label: 'Statistik', ikon: Gauge, to: null },
      { label: 'Dokumen', ikon: Files, to: null },
    ],
  },
  {
    judul: 'Sistem',
    item: [
      { label: 'Akun Staf', ikon: Users, to: null },
      { label: 'Pengaturan', ikon: Settings, to: null },
    ],
  },
]

const inisial = computed(() => {
  const nama = auth.staf?.nama ?? ''
  return nama.split(' ').slice(0, 2).map((k) => k[0]).join('').toUpperCase() || 'ST'
})

const keluar = async () => {
  await auth.logout()
  await navigateTo('/login')
}

// Tutup panel mengambang saat pindah rute
watch(() => route.fullPath, () => {
  sidebarTerbuka.value = false
  menuAkunTerbuka.value = false
})
</script>

<template>
  <div class="min-h-screen bg-canvas">
    <!-- ── Sidebar ── -->
    <aside
      class="fixed inset-y-0 left-0 z-50 flex w-[250px] flex-col border-r border-line bg-surface transition-transform duration-300 lg:translate-x-0"
      :class="sidebarTerbuka ? 'translate-x-0' : '-translate-x-full'"
    >
      <!-- Logo -->
      <NuxtLink to="/dasbor" class="flex h-[68px] flex-shrink-0 items-center gap-2.5 px-5">
        <img src="/images/logo-daak.png" alt="Logo DAAK" class="h-8 w-auto">
        <span class="whitespace-nowrap font-display text-[.9375rem] font-extrabold text-primary">DAAK UT</span>
      </NuxtLink>

      <!-- Navigasi -->
      <nav class="flex-1 overflow-y-auto px-4 pb-4">
        <div v-for="g in grup" :key="g.judul" class="mb-6">
          <p class="mb-2 px-3 text-[.6875rem] font-bold uppercase tracking-[.14em] text-ink-light">
            {{ g.judul }}
          </p>

          <ul class="m-0 flex list-none flex-col gap-1 p-0">
            <li v-for="item in g.item" :key="item.label">
              <NuxtLink
                v-if="item.to"
                :to="item.to"
                class="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors"
                :class="
                  route.path === item.to
                    ? 'bg-primary/[.08] font-bold text-primary'
                    : 'font-medium text-ink-muted hover:bg-canvas hover:text-primary'
                "
              >
                <component :is="item.ikon" :size="18" />
                {{ item.label }}
              </NuxtLink>

              <span
                v-else
                class="flex cursor-not-allowed items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-ink-light"
                :title="`Halaman ${item.label} belum tersedia`"
              >
                <component :is="item.ikon" :size="18" />
                <span class="flex-1">{{ item.label }}</span>
                <span class="rounded-full bg-canvas-2 px-2 py-0.5 text-[.625rem] font-semibold uppercase tracking-wide">
                  Segera
                </span>
              </span>
            </li>
          </ul>
        </div>
      </nav>

      <!-- Kartu pengguna -->
      <div class="flex-shrink-0 border-t border-line p-4">
        <div class="flex items-center gap-3 rounded-xl bg-canvas p-3">
          <span
            class="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-primary font-display text-xs font-bold text-white"
            aria-hidden="true"
          >
            {{ inisial }}
          </span>

          <span class="min-w-0 flex-1 leading-tight">
            <span class="block truncate text-[.8125rem] font-bold text-ink">
              {{ auth.staf?.nama ?? '—' }}
            </span>
            <span class="block truncate text-[.6875rem] text-ink-light">
              {{ auth.staf?.jabatan ?? '' }}
            </span>
          </span>

          <button
            type="button"
            class="flex-shrink-0 rounded-lg p-1.5 text-ink-light transition-colors hover:bg-[#FDECEA] hover:text-[#C0392B]"
            aria-label="Keluar"
            title="Keluar"
            @click="keluar"
          >
            <LogOut :size="16" />
          </button>
        </div>
      </div>
    </aside>

    <!-- Tirai saat sidebar terbuka di layar kecil -->
    <div
      v-show="sidebarTerbuka"
      class="fixed inset-0 z-40 bg-ink/20 lg:hidden"
      aria-hidden="true"
      @click="sidebarTerbuka = false"
    />

    <!-- ── Area konten ── -->
    <div class="lg:pl-[250px]">
      <!-- Topbar -->
      <header class="sticky top-0 z-30 flex h-[68px] items-center gap-4 border-b border-line bg-surface/90 px-5 backdrop-blur sm:px-8">
        <button
          type="button"
          class="rounded-lg p-2 text-ink-muted hover:bg-canvas lg:hidden"
          aria-label="Buka menu samping"
          @click="sidebarTerbuka = true"
        >
          <Menu :size="20" />
        </button>

        <div class="relative hidden max-w-[320px] flex-1 sm:block">
          <label for="cari-dasbor" class="sr-only">Cari di dasbor</label>
          <input
            id="cari-dasbor"
            type="search"
            placeholder="Cari…"
            class="w-full rounded-full border border-line bg-canvas py-2 pl-10 pr-4 text-sm placeholder:text-ink-light focus:border-primary/40 focus:bg-surface focus:outline-none"
          >
          <Search :size="16" class="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-light" />
        </div>

        <div class="ml-auto flex items-center gap-1.5">
          <NuxtLink
            to="/"
            class="hidden items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-ink-muted hover:bg-canvas hover:text-primary sm:flex"
            title="Buka portal publik"
          >
            <Globe :size="17" />
            Portal
          </NuxtLink>

          <button
            type="button"
            class="rounded-lg p-2 text-ink-muted hover:bg-canvas"
            aria-label="Notifikasi"
          >
            <Bell :size="18" />
          </button>

          <!-- Menu akun -->
          <div class="relative">
            <button
              type="button"
              class="flex items-center gap-2 rounded-full py-1 pl-1 pr-2 transition-colors hover:bg-canvas"
              :aria-expanded="menuAkunTerbuka"
              @click="menuAkunTerbuka = !menuAkunTerbuka"
            >
              <span
                class="flex h-8 w-8 items-center justify-center rounded-full bg-primary font-display text-[.6875rem] font-bold text-white"
                aria-hidden="true"
              >
                {{ inisial }}
              </span>
              <span class="hidden text-left leading-tight sm:block">
                <span class="block text-[.8125rem] font-bold text-ink">{{ auth.staf?.nama ?? '—' }}</span>
                <span class="block text-[.6875rem] text-ink-light">{{ auth.staf?.jabatan ?? '' }}</span>
              </span>
              <ChevronDown :size="15" class="text-ink-light" />
            </button>

            <div
              v-show="menuAkunTerbuka"
              class="absolute right-0 top-full z-50 mt-2 w-52 overflow-hidden rounded-xl border border-line bg-surface shadow-pop"
            >
              <p class="mb-0 border-b border-line px-4 py-3 text-xs text-ink-light">
                Masuk sebagai<br>
                <span class="font-semibold text-ink">{{ auth.staf?.email ?? '—' }}</span>
              </p>

              <button
                type="button"
                class="flex w-full items-center gap-2.5 px-4 py-3 text-left text-sm font-medium text-[#C0392B] hover:bg-[#FDECEA]"
                @click="keluar"
              >
                <LogOut :size="16" />
                Keluar
              </button>
            </div>
          </div>
        </div>
      </header>

      <main class="p-5 sm:p-8">
        <slot />
      </main>
    </div>
  </div>
</template>
