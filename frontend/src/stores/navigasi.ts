import { defineStore } from 'pinia'

/* Satu sumber kebenaran untuk menu dan keadaan drawer. Dipakai bersama oleh
   AppNavbar (drawer) dan halaman lain yang perlu menutup drawer saat pindah
   rute, sehingga keadaannya tidak tersebar di beberapa komponen. */
export interface ItemMenu {
  label: string
  to: string
}

export const useNavigasiStore = defineStore('navigasi', () => {
  const menus: ItemMenu[] = [
    { label: 'Beranda', to: '/' },
    { label: 'Registrasi', to: '/registrasi' },
    { label: 'Kelulusan', to: '/kelulusan' },
    { label: 'Kemahasiswaan', to: '/kemahasiswaan' },
    { label: 'PDDIKTI', to: '/pddikti' },
    { label: 'Panduan', to: '/panduan' },
    { label: 'FAQ', to: '/faq' },
    { label: 'Kontak', to: '/kontak' },
  ]

  const drawerTerbuka = ref(false)

  const toggleDrawer = () => (drawerTerbuka.value = !drawerTerbuka.value)
  const tutupDrawer = () => (drawerTerbuka.value = false)

  /** Beranda hanya aktif pada path persis '/', menu lain aktif bila diawali path-nya. */
  const cocok = (to: string, path: string) =>
    to === '/' ? path === '/' : path.startsWith(to)

  return { menus, drawerTerbuka, toggleDrawer, tutupDrawer, cocok }
})
