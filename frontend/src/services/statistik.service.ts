import api from '~/composables/useApi'
import type { ApiResponse, Statistik } from '~/types'

export const statistikService = {
  list: () =>
    api.get<ApiResponse<Statistik[]>>('/api/v1/statistik').then((r) => r.data),
}
