import api from '~/composables/useApi'
import type { ApiResponse, Berita } from '~/types'

export const beritaService = {
  list: (params?: Record<string, unknown>) =>
    api.get<ApiResponse<Berita[]>>('/api/v1/berita', { params }).then((r) => r.data),

  detail: (slug: string) =>
    api.get<ApiResponse<Berita>>(`/api/v1/berita/${slug}`).then((r) => r.data),
}
