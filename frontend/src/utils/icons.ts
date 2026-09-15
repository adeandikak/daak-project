// Peta nama ikon (kolom t_berita.ikon, diisi seeder 03 BE) → komponen
// lucide-vue-next. Nama yang tidak ada di sini jatuh ke FileText TANPA galat —
// tambahkan di sini setiap kali seeder memakai ikon baru.
// Daftar ikon: https://lucide.dev/icons
import {
  Award,
  Box,
  Calendar,
  CircleCheck,
  CircleHelp,
  File,
  FileText,
  Flag,
  GraduationCap,
  Newspaper,
} from 'lucide-vue-next'
import type { Component } from 'vue'

const ICON_MAP: Record<string, Component> = {
  'award': Award,
  'box': Box,
  'calendar': Calendar,
  'circle-check': CircleCheck,
  'circle-help': CircleHelp,
  'file': File,
  'file-text': FileText,
  'flag': Flag,
  'graduation-cap': GraduationCap,
  'newspaper': Newspaper,
}

export function ikon(nama?: string | null): Component {
  return (nama && ICON_MAP[nama]) || FileText
}
