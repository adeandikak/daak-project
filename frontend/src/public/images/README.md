Aset publik portal DAAK UT.

| File | Asal | Dipakai oleh |
|---|---|---|
| `logo-daak.png` | aset resmi portal DAAK (125×31) | `AppTopBar.vue`, `AppFooter.vue`, favicon |
| `hero-illustration.jpg` | aset resmi portal DAAK (1024×1024) | background `HeroSection.vue` |

Keduanya diambil dari portal rujukan agar tampilan identik. Bila aset di
portal induk diperbarui, timpa file dengan nama yang sama — tidak perlu
mengubah kode.

Thumbnail berita **tidak** memakai file gambar: design system menampilkannya
sebagai gradien + ikon SVG, yang datanya dikirim backend lewat field
`gradientFrom`, `gradientTo`, dan `ikonPath`
(`backend/src/modules/berita/berita.service.ts`).

Catatan: path statis seperti `bg-[url('/images/hero-illustration.jpg')]`
di-resolve Vite saat build. Bila file-nya hilang, dev server gagal build —
bukan sekadar 404.
