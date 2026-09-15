import axios from 'axios'

/* Satu tempat menerjemahkan galat jadi kalimat yang boleh dibaca pengguna.
   BE mengirim { success:false, message, errors } lewat GlobalExceptionFilter,
   jadi `message` di sana sudah berbahasa Indonesia dan layak ditampilkan.
   Galat jaringan tidak punya `message` semacam itu — diganti kalimat sendiri. */
export function pesanGalat(err: unknown, bawaan = 'Terjadi kesalahan. Coba lagi.'): string {
  if (axios.isAxiosError(err)) {
    if (!err.response) {
      return 'Tidak dapat menghubungi server. Periksa koneksi Anda.'
    }

    const data = err.response.data as { message?: string } | undefined
    if (data?.message) return data.message
  }

  return bawaan
}
