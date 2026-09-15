import api from '~/composables/useApi'
import type { ApiResponse } from '~/types'

export interface RingkasanDasbor {
  kartu: { pengumuman: number; berita: number; statistik: number }
  pengumuman_per_status: { status: string; jumlah: number }[]
  berita_per_kategori: { kategori: string; jumlah: number }[]
  statistik: { id: number; label: string; nilai: number; suffix: string | null }[]
  terbaru: {
    pengumuman: { id: number; judul: string; tanggal: string; status: string }[]
    berita: { id: number; slug: string; judul: string; tanggal: string; kategori: string }[]
  }
}

export const dasborService = {
  ringkasan: () =>
    api.get<ApiResponse<RingkasanDasbor>>('/api/v1/dasbor/ringkasan').then((r) => r.data),
}
