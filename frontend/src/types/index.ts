/**
 * Kontrak data antara FE dan BE.
 * Nama field mengikuti kolom basis data (snake_case) — entity BE tidak
 * memetakan ulang nama, jadi apa yang ada di tabel itulah yang diterima di sini.
 */

export type StatusPengumuman = 'penting' | 'baru' | 'update'

export interface Pengumuman {
  id: number
  judul: string
  tanggal: string              // 'YYYY-MM-DD'
  status: StatusPengumuman
  isi: string
  cta_label: string | null
  cta_url: string | null
  is_published: boolean
}

export interface Statistik {
  id: number
  label: string
  nilai: number
  suffix: string | null
  urutan: number
}

export interface Berita {
  id: number
  slug: string
  judul: string
  ringkasan: string
  tanggal: string
  kategori: string
  /** Thumbnail design system: gradien + ikon, bukan foto. */
  gradient_from: string
  gradient_to: string
  ikon: string                 // nama ikon, dipetakan di utils/icons.ts
  tautan_url: string
  is_published: boolean
}

/** Amplop respons BE — lihat commons/response/response.util.ts. */
export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  message?: string
  errors?: unknown
}
