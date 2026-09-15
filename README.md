# Portal DAAK Universitas Terbuka

Monorepo: **Nuxt 3 (frontend)** + **NestJS (backend API)** + **PostgreSQL**.

- **Struktur** mengikuti [TEMPLATE_BE](https://github.com/wasil28/TEMPLATE_BE) dan
  [TEMPLATE_FE](https://github.com/wasil28/TEMPLATE_FE).
- **Tampilan** mengikuti bahasa visual landing page [Spike](https://spike-nuxtjs-pro-main.netlify.app/)
  (tombol pil, chip eyebrow, kartu garis rambut, kotak ikon pastel, hero terang
  rata tengah), dengan palet Universitas Terbuka: biru `#003366` + kuning `#FFCC00`.

```
daak-project/
├── backend/     NestJS — src/application/v1/rest/<modul>/
└── frontend/    Nuxt 3 — srcDir src/, service layer + Pinia
```

Panduan rinci tiap sisi: `backend/docs/PANDUAN.md` dan `frontend/docs/PANDUAN.md`.

## Menjalankan

```bash
# Terminal 1 — Backend (http://localhost:3020, Swagger di /api-docs)
cd backend && npm install && npm run migrate && npm run seed && npm run start:dev

# Terminal 2 — Frontend (http://localhost:5174)
cd frontend && npm install && npm run dev
```

Salin `.env.example` menjadi `.env` di masing-masing folder dan isi
`TYPEORM_PASSWORD`.

## Kontrak API

Semua respons memakai amplop `commons/response/response.util.ts`:

```json
{ "success": true, "data": [ ... ], "message": "3 pengumuman" }
```

Galat memakai bentuk yang sama lewat `GlobalExceptionFilter`:

```json
{ "success": false, "message": "Berita \"x\" tidak ditemukan", "errors": null }
```

| Endpoint | Dipakai komponen |
|---|---|
| `GET /api/v1/pengumuman?limit=&status=` | `beranda/PengumumanPenting.vue` |
| `GET /api/v1/pengumuman/:id` | halaman detail (belum dibuat) |
| `GET /api/v1/statistik` | `beranda/StatistikRingkas.vue` |
| `GET /api/v1/berita?limit=&kategori=` | `beranda/BeritaTerbaru.vue` |
| `GET /api/v1/berita/:slug` | halaman detail (belum dibuat) |
| `GET /api/v1/auth/captcha` | `pages/login.vue` — soal penjumlahan |
| `POST /api/v1/auth/login` | `pages/login.vue` — masuk sebagai staf |
| `POST /api/v1/auth/logout` | `stores/auth.ts` |
| `GET /api/v1/auth/me` | `middleware/auth.ts` — pagar rute staf |
| `GET /api/v1/dasbor/ringkasan` | `pages/dasbor/index.vue` (dipagari AuthGuard) |

## Database

PostgreSQL 16.15 di **172.30.13.188** (Ubuntu 24.04).

| Item | Nilai |
|---|---|
| Database | `daak_portal` |
| Role aplikasi | `daak_app` (password di `backend/.env`) |
| Akses jaringan | `listen_addresses = localhost,172.30.13.188` |
| Aturan pg_hba | hanya `daak_app` → `daak_portal` dari IP mesin developer, `scram-sha-256` |
| Tabel | `m_statistik`, `t_pengumuman`, `t_berita`, `m_staf`, `_migrasi` |

Skema adalah **migrasi SQL**, bukan `synchronize` TypeORM (`TYPEORM_SYNC=false`):

```bash
cd backend
npm run migrate   # jalankan .sql yang belum pernah dijalankan
npm run seed      # isi tabel yang masih kosong
```

Backup config server sebelum diubah: `postgresql.conf.bak-daak` dan
`pg_hba.conf.bak-daak` di `/etc/postgresql/16/main/`.

## Beda yang disengaja dari template

| Hal | Template | Di sini | Alasan |
|---|---|---|---|
| Rendering | `ssr: false` (SPA) | `ssr: true` | portal publik perlu terbaca mesin pencari |
| baseURL axios | dibaca di interceptor | diisi `plugins/api.ts` | `useRuntimeConfig()` di interceptor pecah saat SSR |
| Kelas dinamis | `safelist` Tailwind | nama kelas literal | `safelist` tidak menyelamatkan kelas `@layer components` |
| RBAC/Redis | ada | belum dipasang | login staf sudah ada; peran per menu belum diperlukan |
| Package manager | yarn | npm | mengikuti yang sudah dipakai di mesin ini |

## Akun demo staf

Dibuat oleh `04_staf.seeder.ts`. **Ganti sebelum dipakai sungguhan.**

| Email | Kata sandi | Jabatan |
|---|---|---|
| `admin@ecampus.ut.ac.id` | `DaakAdmin2026` | Administrator Sistem |
| `staf@ecampus.ut.ac.id` | `DaakStaf2026` | Staf Layanan Akademik |

Halaman masuk: http://localhost:5174/login — setelah masuk diarahkan ke
http://localhost:5174/dasbor

## Langkah lanjutan

1. Buat halaman `/registrasi`, `/kelulusan`, `/beasiswa`, `/panduan`, `/faq`,
   `/kontak`, `/login` — saat ini baru Beranda, sehingga tautan navigasi masih
   memunculkan warning router.
2. Bila perlu panel admin untuk mengelola pengumuman/berita, salin modul
   `auth`/`users`/`roles`/`menu`/`permissions` beserta migrasi RBAC dari
   TEMPLATE_BE, dan halaman `login`/middleware `auth`/store `auth` dari TEMPLATE_FE.
