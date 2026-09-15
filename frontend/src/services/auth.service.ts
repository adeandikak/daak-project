import api from '~/composables/useApi'
import type { ApiResponse } from '~/types'

export interface Captcha {
  pertanyaan: string
  token: string
  kedaluwarsa: string
}

export interface Staf {
  id: number
  nama: string
  email: string
  jabatan: string | null
}

export interface LoginPayload {
  email: string
  password: string
  captcha_token: string
  captcha_jawaban: number
  /** Perpanjang masa sesi pada perangkat ini. */
  ingat?: boolean
}

/* Satu berkas per modul BE, satu fungsi per endpoint. Token JWT tidak pernah
   lewat sini — BE mengirimnya sebagai cookie httpOnly, jadi browser yang
   menyimpan dan mengirimkannya (axios sudah withCredentials: true). */
export const authService = {
  captcha: () =>
    api.get<ApiResponse<Captcha>>('/api/v1/auth/captcha').then((r) => r.data),

  login: (payload: LoginPayload) =>
    api.post<ApiResponse<{ staf: Staf }>>('/api/v1/auth/login', payload).then((r) => r.data),

  /** Profil dari sesi aktif — dipakai middleware untuk memagari rute. */
  me: () => api.get<ApiResponse<{ staf: Staf }>>('/api/v1/auth/me').then((r) => r.data),

  logout: () => api.post<ApiResponse<null>>('/api/v1/auth/logout').then((r) => r.data),
}
