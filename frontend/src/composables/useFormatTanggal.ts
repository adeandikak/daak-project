/** Format tanggal ISO -> '01 September 2026' (locale id-ID). */
export const useFormatTanggal = () => {
  const formatTanggal = (iso: string, opts: Intl.DateTimeFormatOptions = {}) => {
    if (!iso) return '-'
    return new Intl.DateTimeFormat('id-ID', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      ...opts,
    }).format(new Date(iso))
  }

  return { formatTanggal }
}
