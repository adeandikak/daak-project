<script setup lang="ts">
import { Mail, MapPin, Phone } from 'lucide-vue-next'

/** Footer terang dan lapang, ditutup satu baris hak cipta di tengah (gaya Spike). */
const tautanCepat = [
  { label: 'Portal SIA UT', href: 'https://sia.ut.ac.id', eksternal: true },
  { label: 'Layanan Elearning', href: 'https://elearning.ut.ac.id', eksternal: true },
  { label: 'Kalender Akademik', href: '/panduan', eksternal: false },
  { label: 'Cek Keaslian Ijazah', href: '/kelulusan', eksternal: false },
  { label: 'Pendaftaran Wisuda', href: '/kelulusan', eksternal: false },
]

const jamLayanan = [
  { hari: 'Senin – Kamis', jam: '07:30 – 16:00 WIB', tutup: false },
  { hari: 'Jumat', jam: '07:30 – 16:30 WIB', tutup: false },
  { hari: 'Sabtu – Minggu', jam: 'Tutup', tutup: true },
]

const tahun = new Date().getFullYear()
</script>

<template>
  <footer class="border-t border-line bg-surface">
    <div class="container py-16">
      <div class="grid grid-cols-1 gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
        <!-- Kolom 1: identitas + kontak -->
        <div>
          <div class="flex items-center gap-3">
            <img src="/images/logo-daak.png" alt="Logo DAAK" class="h-9 w-auto">
            <div>
              <div class="font-display text-[1.0625rem] font-extrabold text-primary">DAAK UT</div>
              <div class="text-[.6875rem] font-medium uppercase tracking-[.12em] text-ink-light">
                Universitas Terbuka
              </div>
            </div>
          </div>

          <p class="mt-5 max-w-[340px] text-sm leading-relaxed">
            Direktorat Administrasi Akademik dan Kemahasiswaan — pusat layanan
            administrasi akademik bagi seluruh mahasiswa UT.
          </p>

          <ul class="m-0 mt-6 flex list-none flex-col gap-3 p-0 text-sm">
            <li class="flex items-start gap-2.5 text-ink-muted">
              <MapPin :size="16" class="mt-0.5 flex-shrink-0 text-ink-light" />
              <span>Jl. Cabe Raya, Pamulang, Tangerang Selatan, Banten 15437</span>
            </li>
            <li class="flex items-center gap-2.5 text-ink-muted">
              <Phone :size="16" class="flex-shrink-0 text-ink-light" />
              <a href="tel:1500024" class="font-semibold text-ink hover:text-primary">1500024</a>
            </li>
            <li class="flex items-center gap-2.5 text-ink-muted">
              <Mail :size="16" class="flex-shrink-0 text-ink-light" />
              <a href="mailto:daak@ecampus.ut.ac.id" class="hover:text-primary">
                daak@ecampus.ut.ac.id
              </a>
            </li>
          </ul>
        </div>

        <!-- Kolom 2: tautan cepat -->
        <div>
          <h3 class="mb-5 text-[.8125rem] font-bold uppercase tracking-[.1em] text-ink-light">
            Tautan Cepat
          </h3>

          <ul class="m-0 flex list-none flex-col gap-3 p-0 text-sm">
            <li v-for="tautan in tautanCepat" :key="tautan.label">
              <a
                v-if="tautan.eksternal"
                :href="tautan.href"
                target="_blank"
                rel="noopener noreferrer"
                class="text-ink-muted transition-colors hover:text-primary"
              >
                {{ tautan.label }}
              </a>
              <NuxtLink
                v-else
                :to="tautan.href"
                class="text-ink-muted transition-colors hover:text-primary"
              >
                {{ tautan.label }}
              </NuxtLink>
            </li>
          </ul>
        </div>

        <!-- Kolom 3: jam pelayanan -->
        <div>
          <h3 class="mb-5 text-[.8125rem] font-bold uppercase tracking-[.1em] text-ink-light">
            Jam Pelayanan
          </h3>

          <ul class="m-0 flex list-none flex-col gap-3 p-0 text-sm">
            <li
              v-for="jadwal in jamLayanan"
              :key="jadwal.hari"
              class="flex items-center justify-between gap-4"
            >
              <span class="text-ink-muted">{{ jadwal.hari }}</span>
              <span
                class="font-semibold"
                :class="jadwal.tutup ? 'text-[#C0392B]' : 'text-ink'"
              >{{ jadwal.jam }}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Baris penutup, rata tengah seperti Spike -->
    <div class="border-t border-line">
      <div class="container flex flex-col items-center gap-3 py-6 text-[.8125rem] text-ink-light sm:flex-row sm:justify-between">
        <p class="mb-0">
          &copy; {{ tahun }} DAAK Universitas Terbuka. Hak cipta dilindungi.
        </p>

        <div class="flex gap-6">
          <NuxtLink to="/ketentuan" class="hover:text-primary">Ketentuan Layanan</NuxtLink>
          <NuxtLink to="/privasi" class="hover:text-primary">Kebijakan Privasi</NuxtLink>
          <NuxtLink to="/peta-situs" class="hover:text-primary">Peta Situs</NuxtLink>
        </div>
      </div>
    </div>
  </footer>
</template>
