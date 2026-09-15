# Panduan Frontend — Portal DAAK UT

Struktur mengikuti **TEMPLATE_FE** (github.com/wasil28/TEMPLATE_FE).

## Peta folder

```
src/
├── App.vue                     cangkang: NuxtLayout > NuxtPage
├── assets/css/
│   ├── tokens.css              variabel desain (warna, font, radius, bayangan)
│   └── tailwind.css            lapisan komponen (.btn, .badge, .card-white, ...)
├── components/
│   ├── layout/                 AppTopBar, AppNavbar, AppFooter
│   └── beranda/                section halaman depan
├── composables/                useApi (axios), useFormatTanggal
├── layouts/                    default (portal publik), blank
├── pages/                      rute
├── public/                     aset statis
├── services/                   satu berkas per modul BE, satu fungsi per endpoint
├── stores/                     Pinia
├── types/                      kontrak data dengan BE
└── utils/                      icons (peta nama→komponen lucide), error.handler
```

## Aturan yang dipegang

- **Komponen tidak memanggil `api` langsung.** Selalu lewat `services/`,
  supaya perubahan URL cukup di satu tempat.
- Komponen di-auto-import **tanpa awalan folder**
  (`components.pathPrefix = false`), jadi `beranda/HeroSection.vue` dipanggil
  `<HeroSection />`. Konsekuensinya nama berkas harus unik lintas folder.
- Warna ditulis di **dua** tempat: `tokens.css` (variabel CSS) dan
  `tailwind.config.js` (agar Tailwind bisa menghitung opacity). Ubah keduanya.
- Kelas yang dirangkai dinamis — mis. `badge-${status}` — wajib didaftarkan di
  `safelist` Tailwind, kalau tidak variannya dibuang saat build dan badge jadi
  transparan tanpa pesan galat.
- Ikon berasal dari `lucide-vue-next`. Nama ikon yang datang dari basis data
  (`t_berita.ikon`) dipetakan di `utils/icons.ts`; nama tak dikenal jatuh ke
  `FileText` tanpa galat.
- Pengambilan data memakai `useAsyncData` yang membungkus service, supaya ikut
  berjalan saat SSR dan tidak diambil ulang di klien.

## Bahasa visual

Bentuk mengikuti landing page **Spike** (spike-nuxtjs-pro-main.netlify.app),
palet tetap milik Universitas Terbuka:

| Unsur | Dari Spike | Warna |
|---|---|---|
| Tombol | berbentuk pil (`rounded-full`) + bayangan glow | biru UT / kuning UT |
| Eyebrow | chip membulat di atas judul section | `.chip-primary`, `.chip-accent` |
| Kartu | garis rambut, sudut 20px, bayangan nyaris nol | putih di atas `canvas` |
| Kotak ikon | persegi membulat bertint pastel | 6 varian `.icon-box-*` |
| Hero | terang, rata tengah, judul raksasa | `bg-grad-hero` |
| Pita gelap | kartu membulat penuh ornamen | `.cta-band` biru tua UT |
| Font | Plus Jakarta Sans untuk judul dan isi | — |

Spike memakai Vuetify; di sini seluruhnya ditiru dengan Tailwind agar
struktur TEMPLATE_FE tetap utuh dan CSS tetap ringan.

## Area staf (dasbor)

| Berkas | Peran |
|---|---|
| `layouts/dasbor.vue` | sidebar + topbar, kartu pengguna, tombol keluar |
| `pages/dasbor/index.vue` | dasbor; `definePageMeta({ middleware: 'auth' })` |
| `middleware/auth.ts` | memanggil `/api/v1/auth/me`, bukan membaca localStorage |
| `components/dasbor/` | `KartuAngka`, `GrafikDonat`, `GrafikBatang` |

Dua hal yang mudah salah:

- **Rute `/dasbor/**` dirender di klien** (`routeRules: { ssr: false }`).
  Pada SSR, axios di server tidak membawa cookie browser, sehingga
  pemeriksaan sesi selalu gagal. Merendernya di klien membuat cookie ikut
  terkirim otomatis. Portal publik tetap SSR.
- **`pathPrefix: false` berlaku juga di sini**: `dasbor/KartuAngka.vue`
  dipanggil `<KartuAngka />`, bukan `<DasborKartuAngka />`. Nama yang salah
  tidak memunculkan galat — komponennya hanya hilang dari layar.

Grafik digambar sebagai SVG sendiri, bukan memakai ApexCharts seperti
template: kebutuhannya hanya donat dan batang, sedangkan pustakanya
menambah ratusan kilobyte.

## Beda dengan template

Template memakai `ssr: false` karena isinya panel admin di balik login.
Portal DAAK adalah halaman publik yang perlu terbaca mesin pencari, jadi
**SSR dibiarkan menyala**. Selebihnya konfigurasi mengikuti template.

Halaman `login`, layout `auth.vue` (dua panel: merek di kiri, formulir di
kanan), service `auth.service.ts`, dan store `auth.ts` sudah ada.

Halaman masuk punya pemilih jenis pengguna **Mahasiswa / Staf**, tetapi hanya
tab Staf yang memiliki autentikasi — portal ini tidak menyimpan akun mahasiswa.
Tab Mahasiswa menampilkan arahan ke SIA UT, bukan formulir yang tidak akan
pernah berhasil. Catatan akun uji hanya muncul saat pengembangan
(`runtimeConfig.public.tampilkanAkunDemo`, di-bake `false` pada build produksi)
dan hanya menyebut berkas seeder — bukan kata sandinya. Yang belum: `lupa-password`, `reset-sandi`, dan
middleware `auth` untuk memagari rute — belum ada halaman yang perlu dipagari.

Token JWT TIDAK disimpan di store: BE mengirimnya sebagai cookie httpOnly.
`stores/auth.ts` hanya menyimpan profil untuk ditampilkan, jadi isi
localStorage di sana bukan kredensial.

## Perintah

```bash
npm run dev        # http://localhost:5174
npm run build
npm run typecheck
```
