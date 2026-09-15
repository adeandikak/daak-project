import api from '~/composables/useApi'
import type { ApiResponse, Pengumuman } from '~/types'

/* Satu berkas per modul BE, satu fungsi per endpoint. Tidak ada logika di
   sini — hanya bentuk URL dan cara mengirimnya. Komponen TIDAK memanggil
   `api` langsung; semuanya lewat service supaya perubahan URL cukup di
   satu tempat. */
export const pengumumanService = {
  list: (params?: Record<string, unknown>) =>
    api
      .get<ApiResponse<Pengumuman[]>>('/api/v1/pengumuman', { params })
      .then((r) => r.data),

  detail: (id: number) =>
    api.get<ApiResponse<Pengumuman>>(`/api/v1/pengumuman/${id}`).then((r) => r.data),
}
