<script setup lang="ts">
import {
  ArrowLeft,
  Briefcase,
  Eye,
  EyeOff,
  GraduationCap,
  Info,
  LogIn,
  RefreshCw,
} from 'lucide-vue-next'

import { authService, type Captcha } from '~/services/auth.service'
import { useAuthStore } from '~/stores/auth'
import { pesanGalat } from '~/utils/error.handler'

/**
 * Masuk ke Portal DAAK UT.
 *
 * Pemilih jenis pengguna ada dua, sesuai rancangan. Namun HANYA tab
 * "Staf / Pegawai" yang memiliki autentikasi: portal ini belum menyimpan akun
 * mahasiswa, dan layanan akademik mahasiswa berjalan di SIA UT. Tab Mahasiswa
 * karena itu menampilkan arahan, bukan formulir yang tidak akan pernah berhasil.
 *
 * Captcha penjumlahan tetap dipertahankan dan diverifikasi di server —
 * jawabannya tidak pernah dikirim ke klien.
 */
definePageMeta({ layout: 'auth' })

useHead({ title: 'Masuk — Portal DAAK Universitas Terbuka' })

const auth = useAuthStore()
const route = useRoute()

type JenisPengguna = 'mahasiswa' | 'staf'

const jenis = ref<JenisPengguna>('staf')

const tabs: { nilai: JenisPengguna; label: string; ikon: typeof GraduationCap }[] = [
  { nilai: 'mahasiswa', label: 'Mahasiswa', ikon: GraduationCap },
  { nilai: 'staf', label: 'Staf / Pegawai', ikon: Briefcase },
]

const form = reactive({
  email: '',
  password: '',
  jawaban: '' as string | number,
  ingat: false,
})

/* Akun uji hasil `npm run seed`. Ditampilkan HANYA saat pengembangan
   (runtimeConfig.public.tampilkanAkunDemo di-bake false pada build produksi).
   Nilainya harus sama dengan BENIH di backend 04_staf.seeder.ts. */
const akunUji = [
  { email: 'admin@ecampus.ut.ac.id', sandi: 'DaakAdmin2026', peran: 'Administrator' },
  { email: 'staf@ecampus.ut.ac.id', sandi: 'DaakStaf2026', peran: 'Staf Layanan' },
]

/** Isi formulir dengan akun uji — satu klik, tanpa salah ketik. */
const pakaiAkun = (akun: { email: string; sandi: string }) => {
  form.email = akun.email
  form.password = akun.sandi
  galat.value = ''
}

const captcha = ref<Captcha | null>(null)
const memuatCaptcha = ref(false)
const lihatSandi = ref(false)
const galat = ref('')
const galatField = reactive<Record<string, string>>({})

const muatCaptcha = async () => {
  memuatCaptcha.value = true
  form.jawaban = ''

  try {
    const res = await authService.captcha()
    captcha.value = res.data ?? null
  } catch (e) {
    galat.value = pesanGalat(e, 'Gagal memuat captcha.')
  } finally {
    memuatCaptcha.value = false
  }
}

// Soal baru diminta saat halaman dibuka di klien — tidak perlu ikut SSR
onMounted(muatCaptcha)

const validasi = (): boolean => {
  galatField.email = ''
  galatField.password = ''
  galatField.jawaban = ''

  if (!form.email.trim()) galatField.email = 'Email wajib diisi.'
  else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email.trim())) {
    galatField.email = 'Format email tidak valid.'
  }

  if (!form.password) galatField.password = 'Kata sandi wajib diisi.'
  else if (form.password.length < 8) {
    galatField.password = 'Kata sandi minimal 8 karakter.'
  }

  if (form.jawaban === '' || form.jawaban === null) {
    galatField.jawaban = 'Isi hasil penjumlahan.'
  }

  return !galatField.email && !galatField.password && !galatField.jawaban
}

const kirim = async () => {
  galat.value = ''

  if (!validasi()) return

  if (!captcha.value) {
    galat.value = 'Captcha belum siap. Muat ulang soal.'
    return
  }

  try {
    await auth.login({
      email: form.email.trim().toLowerCase(),
      password: form.password,
      captcha_token: captcha.value.token,
      captcha_jawaban: Number(form.jawaban),
      ingat: form.ingat,
    })

    // Middleware menaruh tujuan asal di ?lanjut saat menolak akses
    const lanjut = route.query.lanjut
    await navigateTo(typeof lanjut === 'string' && lanjut.startsWith('/') ? lanjut : '/dasbor')
  } catch (e) {
    galat.value = pesanGalat(e, 'Gagal masuk. Coba lagi.')
    // Token captcha hangus begitu dipakai — selalu ambil soal baru
    await muatCaptcha()
    form.password = ''
  }
}
</script>

<template>
  <div>
    <NuxtLink
      to="/"
      class="inline-flex items-center gap-2 text-sm font-medium text-ink-muted transition-colors hover:text-primary"
    >
      <ArrowLeft :size="16" />
      Kembali ke Beranda
    </NuxtLink>

    <p class="mt-8 text-[.75rem] font-bold uppercase tracking-[.16em] text-primary">
      Portal DAAK UT
    </p>

    <h1 class="mt-2 font-display text-[1.75rem] font-extrabold leading-tight">
      Masuk ke Akun Anda
    </h1>

    <p class="mt-1.5 text-sm">Pilih jenis pengguna untuk melanjutkan.</p>

    <!-- Pemilih jenis pengguna -->
    <div
      class="mt-7 grid grid-cols-2 gap-1 rounded-xl border border-line bg-canvas-2 p-1"
      role="tablist"
      aria-label="Jenis pengguna"
    >
      <button
        v-for="tab in tabs"
        :key="tab.nilai"
        type="button"
        role="tab"
        :aria-selected="jenis === tab.nilai"
        class="flex items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm transition-all duration-200"
        :class="
          jenis === tab.nilai
            ? 'bg-surface font-bold text-primary shadow-card'
            : 'font-medium text-ink-muted hover:text-ink'
        "
        @click="jenis = tab.nilai"
      >
        <component :is="tab.ikon" :size="16" />
        {{ tab.label }}
      </button>
    </div>

    <!-- ── Tab Mahasiswa: arahan, bukan formulir ── -->
    <div v-if="jenis === 'mahasiswa'" class="mt-6">
      <div class="flex gap-3 rounded-xl border border-[#F3E2BA] bg-[#FFF6E5] px-4 py-3.5">
        <Info :size="17" class="mt-0.5 flex-shrink-0 text-[#B4820A]" />
        <p class="mb-0 text-[.8125rem] leading-relaxed text-[#8A6D00]">
          Akun mahasiswa tidak dikelola di portal ini. Registrasi mata kuliah,
          nilai, dan layanan akademik lainnya diakses melalui
          <strong>SIA UT</strong>.
        </p>
      </div>

      <a
        href="https://sia.ut.ac.id"
        target="_blank"
        rel="noopener noreferrer"
        class="btn btn-primary mt-6 w-full"
      >
        <LogIn :size="17" />
        Buka SIA UT
      </a>

      <p class="mt-6 text-center text-[.8125rem] text-ink-light">
        Belum terdaftar?
        <NuxtLink to="/registrasi" class="font-semibold text-primary hover:underline">
          Pelajari cara registrasi
        </NuxtLink>
      </p>
    </div>

    <!-- ── Tab Staf: formulir sesungguhnya ── -->
    <div v-else class="mt-6">
      <!-- Catatan akun uji — hanya saat pengembangan, tidak pernah ikut ke produksi -->
      <div
        v-if="$config.public.tampilkanAkunDemo"
        class="mb-6 rounded-xl border border-[#F3E2BA] bg-[#FFF6E5] px-4 py-3.5"
      >
        <div class="flex gap-3">
          <Info :size="17" class="mt-0.5 flex-shrink-0 text-[#B4820A]" />
          <p class="mb-0 text-[.8125rem] leading-relaxed text-[#8A6D00]">
            Akun uji dari
            <code class="rounded bg-white/70 px-1 font-mono text-[.75rem]">npm run seed</code>.
            Klik salah satu untuk mengisi formulir.
          </p>
        </div>

        <ul class="m-0 mt-3 flex list-none flex-col gap-2 p-0">
          <li v-for="akun in akunUji" :key="akun.email">
            <button
              type="button"
              class="flex w-full items-center justify-between gap-3 rounded-lg border border-[#F3E2BA] bg-white/70 px-3 py-2 text-left transition-colors hover:border-[#B4820A]/50 hover:bg-white"
              @click="pakaiAkun(akun)"
            >
              <span class="min-w-0">
                <span class="block truncate font-mono text-[.75rem] font-semibold text-[#8A6D00]">
                  {{ akun.email }}
                </span>
                <span class="block font-mono text-[.75rem] text-[#B4820A]">{{ akun.sandi }}</span>
              </span>

              <span class="flex-shrink-0 text-[.6875rem] font-semibold uppercase tracking-wide text-[#B4820A]">
                {{ akun.peran }}
              </span>
            </button>
          </li>
        </ul>
      </div>

      <p v-if="galat" class="alert-danger mb-6" role="alert">{{ galat }}</p>

      <form class="flex flex-col gap-5" novalidate @submit.prevent="kirim">
        <!-- Email -->
        <div>
          <label for="email" class="mb-2 block text-sm font-semibold text-ink">
            Email staf
          </label>

          <input
            id="email"
            v-model="form.email"
            type="email"
            autocomplete="username"
            placeholder="nama@ecampus.ut.ac.id"
            class="w-full rounded-xl border bg-canvas px-4 py-3 text-sm transition-colors placeholder:text-ink-light focus:bg-surface focus:outline-none"
            :class="galatField.email ? 'border-[#E9A79F] focus:border-[#C0392B]' : 'border-line focus:border-primary/40'"
            :aria-invalid="!!galatField.email"
            :aria-describedby="galatField.email ? 'galat-email' : undefined"
          >

          <p v-if="galatField.email" id="galat-email" class="mt-1.5 text-xs text-[#C0392B]">
            {{ galatField.email }}
          </p>
        </div>

        <!-- Kata sandi -->
        <div>
          <div class="mb-2 flex items-baseline justify-between gap-3">
            <label for="password" class="block text-sm font-semibold text-ink">Kata Sandi</label>

            <a
              href="mailto:daak@ecampus.ut.ac.id?subject=Permintaan%20reset%20kata%20sandi%20staf"
              class="text-[.8125rem] font-semibold text-primary hover:underline"
            >
              Lupa sandi?
            </a>
          </div>

          <div class="relative">
            <input
              id="password"
              v-model="form.password"
              :type="lihatSandi ? 'text' : 'password'"
              autocomplete="current-password"
              placeholder="Masukkan kata sandi"
              class="w-full rounded-xl border bg-canvas py-3 pl-4 pr-12 text-sm transition-colors placeholder:text-ink-light focus:bg-surface focus:outline-none"
              :class="galatField.password ? 'border-[#E9A79F] focus:border-[#C0392B]' : 'border-line focus:border-primary/40'"
              :aria-invalid="!!galatField.password"
              :aria-describedby="galatField.password ? 'galat-password' : undefined"
            >
            <button
              type="button"
              class="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-ink-light hover:bg-canvas-2 hover:text-ink"
              :aria-label="lihatSandi ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'"
              @click="lihatSandi = !lihatSandi"
            >
              <component :is="lihatSandi ? EyeOff : Eye" :size="17" />
            </button>
          </div>

          <p v-if="galatField.password" id="galat-password" class="mt-1.5 text-xs text-[#C0392B]">
            {{ galatField.password }}
          </p>
        </div>

        <!-- Captcha penjumlahan -->
        <div>
          <label for="captcha" class="mb-2 block text-sm font-semibold text-ink">
            Verifikasi: berapa hasilnya?
          </label>

          <div class="flex items-stretch gap-2">
            <div
              class="flex min-w-[112px] select-none items-center justify-center rounded-xl border border-line bg-canvas-2 px-4 font-display text-base font-extrabold tracking-wider text-primary"
              aria-live="polite"
            >
              <span v-if="memuatCaptcha" class="text-sm font-medium text-ink-light">memuat…</span>
              <span v-else>{{ captcha?.pertanyaan ?? '—' }} = ?</span>
            </div>

            <input
              id="captcha"
              v-model="form.jawaban"
              type="number"
              inputmode="numeric"
              autocomplete="off"
              placeholder="Jawaban"
              class="min-w-0 flex-1 rounded-xl border bg-canvas px-4 py-3 text-sm transition-colors placeholder:text-ink-light focus:bg-surface focus:outline-none"
              :class="galatField.jawaban ? 'border-[#E9A79F] focus:border-[#C0392B]' : 'border-line focus:border-primary/40'"
              :aria-invalid="!!galatField.jawaban"
              :aria-describedby="galatField.jawaban ? 'galat-captcha' : undefined"
            >

            <button
              type="button"
              class="flex w-11 flex-shrink-0 items-center justify-center rounded-xl border border-line text-ink-muted transition-colors hover:border-primary/40 hover:text-primary"
              aria-label="Ganti soal captcha"
              :disabled="memuatCaptcha"
              @click="muatCaptcha"
            >
              <RefreshCw :size="16" :class="memuatCaptcha ? 'animate-spin' : ''" />
            </button>
          </div>

          <p v-if="galatField.jawaban" id="galat-captcha" class="mt-1.5 text-xs text-[#C0392B]">
            {{ galatField.jawaban }}
          </p>
        </div>

        <!-- Ingat saya -->
        <label class="flex cursor-pointer items-center gap-2.5 text-sm text-ink-muted">
          <input
            v-model="form.ingat"
            type="checkbox"
            class="h-4 w-4 cursor-pointer rounded border-line text-primary accent-primary"
          >
          Ingat saya di perangkat ini
        </label>

        <button type="submit" class="btn btn-primary w-full" :disabled="auth.sedangProses">
          <LogIn v-if="!auth.sedangProses" :size="17" />
          {{ auth.sedangProses ? 'Memproses…' : 'Masuk sebagai Staf' }}
        </button>
      </form>

      <p class="mt-6 text-center text-[.8125rem] text-ink-light">
        Belum punya akun staf?
        <a href="mailto:daak@ecampus.ut.ac.id" class="font-semibold text-primary hover:underline">
          Hubungi administrator
        </a>
      </p>
    </div>
  </div>
</template>
