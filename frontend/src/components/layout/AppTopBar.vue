<script setup lang="ts">
import { Mail, Phone, Search, UserRound } from 'lucide-vue-next'

/** Baris atas: logo DAAK, kontak singkat, pencarian, tombol login berbentuk pil. */
const saran = [
  { label: 'Registrasi Mata Kuliah', to: '/registrasi' },
  { label: 'Syarat Kelulusan & Wisuda', to: '/kelulusan' },
  { label: 'Beasiswa KIP & CSR', to: '/kemahasiswaan' },
  { label: 'Data PDDIKTI Mahasiswa', to: '/pddikti' },
  { label: 'Cetak Transkrip Akademik', to: '/surat' },
]

const kataKunci = ref('')
const sedangFokus = ref(false)

const hasil = computed(() => {
  const q = kataKunci.value.trim().toLowerCase()
  if (!q) return saran
  return saran.filter((s) => s.label.toLowerCase().includes(q))
})

// Beri jeda agar klik pada item sempat terproses sebelum dropdown ditutup
const saatBlur = () => setTimeout(() => (sedangFokus.value = false), 150)
</script>

<template>
  <div class="flex min-h-[68px] items-center bg-surface">
    <div class="container flex w-full items-center justify-between gap-8">
      <!-- Logo + identitas -->
      <NuxtLink
        to="/"
        class="flex flex-shrink-0 items-center"
        aria-label="Beranda DAAK Universitas Terbuka"
      >
        <img
          src="/images/logo-daak.png"
          alt="Logo DAAK"
          title="Direktorat Administrasi Akademik dan Kemahasiswaan"
          class="block h-[38px] w-auto flex-shrink-0 object-contain"
        >

        <span class="mx-3.5 h-8 w-px flex-shrink-0 bg-line" aria-hidden="true" />

        <div class="leading-tight">
          <div class="font-display text-[.8125rem] font-bold text-primary sm:whitespace-nowrap">
            Direktorat Administrasi Akademik dan Kemahasiswaan
          </div>
          <div class="mt-0.5 text-[.6875rem] font-medium uppercase tracking-[.12em] text-ink-light">
            Universitas Terbuka
          </div>
        </div>
      </NuxtLink>

      <!-- Sisi kanan -->
      <div class="flex flex-shrink-0 items-center gap-3">
        <!-- Kontak (tampil mulai 1100px) -->
        <div
          class="hidden items-center gap-5 pr-2 text-[.8125rem] text-ink-muted min-[1100px]:flex"
        >
          <div class="flex items-center gap-1.5 whitespace-nowrap">
            <Phone :size="15" class="text-ink-light" />
            <span class="font-semibold text-ink">1500024</span>
          </div>

          <div class="flex items-center gap-1.5 whitespace-nowrap">
            <Mail :size="15" class="text-ink-light" />
            <a href="mailto:daak@ecampus.ut.ac.id" class="hover:text-primary">
              daak@ecampus.ut.ac.id
            </a>
          </div>
        </div>

        <!-- Pencarian (disembunyikan di bawah 860px) -->
        <div class="relative w-[210px] flex-shrink-0 max-[860px]:hidden">
          <label for="cari-layanan" class="sr-only">Cari layanan akademik</label>

          <input
            id="cari-layanan"
            v-model="kataKunci"
            type="search"
            placeholder="Cari layanan…"
            class="w-full rounded-full border border-line bg-canvas py-2.5 pl-10 pr-4 text-sm transition-colors duration-200 placeholder:text-ink-light focus:border-primary/40 focus:bg-surface focus:outline-none"
            @focus="sedangFokus = true"
            @blur="saatBlur"
          >

          <Search
            :size="16"
            class="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-light"
          />

          <div
            v-show="sedangFokus && hasil.length"
            class="absolute left-0 right-0 top-full z-[100] mt-2 overflow-hidden rounded-xl border border-line bg-surface shadow-pop"
          >
            <NuxtLink
              v-for="item in hasil"
              :key="item.to"
              :to="item.to"
              class="block border-b border-line-subtle px-4 py-3 text-sm text-ink transition-colors duration-200 last:border-b-0 hover:bg-canvas hover:text-primary"
            >
              {{ item.label }}
            </NuxtLink>
          </div>
        </div>

        <NuxtLink to="/login" class="btn btn-primary btn-sm">
          <UserRound :size="15" />
          Login Staf
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
