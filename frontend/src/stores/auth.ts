import { defineStore } from 'pinia'

import { authService, type LoginPayload, type Staf } from '~/services/auth.service'

const KUNCI = 'daak_staf'

/* Store ini hanya menyimpan data TAMPILAN (nama, jabatan). Tokennya ada di
   cookie httpOnly yang tidak bisa dibaca JavaScript — jadi isi localStorage
   di sini bukan kredensial, dan menghapusnya tidak membuat sesi ikut hilang;
   itu urusan endpoint logout.

   Konsekuensinya: localStorage TIDAK boleh dipakai sebagai penentu "sudah
   masuk". Siapa pun bisa mengisinya lewat devtools. Yang menentukan adalah
   jawaban server di periksaSesi(). */
export const useAuthStore = defineStore('auth', () => {
  const staf = ref<Staf | null>(null)
  const sedangProses = ref(false)
  const sesiDiperiksa = ref(false)

  const sudahMasuk = computed(() => staf.value !== null)

  const simpanProfil = (profil: Staf | null) => {
    staf.value = profil

    if (!import.meta.client) return

    if (profil) localStorage.setItem(KUNCI, JSON.stringify(profil))
    else localStorage.removeItem(KUNCI)
  }

  /** Pulihkan tampilan cepat dari localStorage — hanya agar layar tidak berkedip. */
  const pulihkan = () => {
    if (!import.meta.client || staf.value) return

    const tersimpan = localStorage.getItem(KUNCI)
    if (!tersimpan) return

    try {
      staf.value = JSON.parse(tersimpan) as Staf
    } catch {
      localStorage.removeItem(KUNCI)
    }
  }

  /** Tanya server apakah sesi masih sah. Sumber kebenaran, bukan localStorage. */
  const periksaSesi = async (paksa = false): Promise<boolean> => {
    if (sesiDiperiksa.value && !paksa) return sudahMasuk.value

    pulihkan()

    try {
      const res = await authService.me()
      simpanProfil(res.data?.staf ?? null)
      return sudahMasuk.value
    } catch {
      simpanProfil(null)
      return false
    } finally {
      sesiDiperiksa.value = true
    }
  }

  const login = async (payload: LoginPayload) => {
    sedangProses.value = true

    try {
      const res = await authService.login(payload)
      simpanProfil(res.data?.staf ?? null)
      sesiDiperiksa.value = true
      return res
    } finally {
      sedangProses.value = false
    }
  }

  const logout = async () => {
    try {
      await authService.logout()
    } finally {
      simpanProfil(null)
      sesiDiperiksa.value = true
    }
  }

  return { staf, sedangProses, sudahMasuk, pulihkan, periksaSesi, login, logout }
})
