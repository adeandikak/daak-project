import { useAuthStore } from '~/stores/auth'

/**
 * Pagar rute staf. Dipakai lewat definePageMeta({ middleware: 'auth' }).
 *
 * Kebenaran sesi ada di server: token JWT tersimpan dalam cookie httpOnly yang
 * tidak bisa dibaca JavaScript. Karena itu middleware ini MEMANGGIL
 * /api/v1/auth/me, bukan sekadar memeriksa localStorage — isi localStorage bisa
 * dipalsukan siapa saja lewat devtools, sedangkan cookie-nya tidak.
 *
 * Rute dasbor dirender di klien (routeRules ssr:false), jadi pemeriksaan ini
 * berjalan di browser tempat cookie ikut terkirim otomatis.
 */
export default defineNuxtRouteMiddleware(async (to) => {
  const auth = useAuthStore()

  const sah = await auth.periksaSesi()

  if (!sah) {
    return navigateTo({ path: '/login', query: { lanjut: to.fullPath } })
  }
})
