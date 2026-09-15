# Panduan Backend — Portal DAAK UT

Struktur mengikuti **TEMPLATE_BE** (github.com/wasil28/TEMPLATE_BE).
Berkas ini menjelaskan letak setiap hal dan cara menambah modul baru.

## Peta folder

```
src/
├── main.ts                          bootstrap: helmet, CORS, rate limit, Swagger
├── application/
│   ├── app.module.ts                daftar entity + koneksi TypeORM
│   └── v1/
│       ├── v1.module.ts             satu tempat mendaftarkan modul domain
│       └── rest/<modul>/            controller + service + module + dto/
├── commons/response/                amplop respons { success, data, message }
├── config/                          logger (winston)
├── entities/                        seluruh entity, datar, m-/t- prefix
├── infrastructure/
│   ├── types/pagination.payload.ts  DTO paginasi bersama
│   └── utils/exception.ts           GlobalExceptionFilter
└── resources/
    ├── migrations/*.sql             skema — sumber kebenaran
    └── seeders/*.seeder.ts          data awal, dijalankan runner
```

## Menambah modul domain baru

1. **Migrasi** — buat `src/resources/migrations/00N_nama.sql`. Tulis CHECK,
   UNIQUE, dan FK di sini, bukan hanya di DTO. Jalankan `npm run migrate`.
2. **Entity** — `src/entities/<m|t>-nama.entity.ts`. Awalan `m_` untuk
   master/referensi, `t_` untuk transaksi. Kolom snake_case, audit lengkap.
3. **Daftarkan entity** di `application/app.module.ts` **dan** di
   `resources/seeders/seeder.runner.ts`. Keduanya berdiri sendiri; glob
   sengaja tidak dipakai supaya entity tanpa tabel ketahuan saat boot.
4. **Modul** — `application/v1/rest/<nama>/` berisi `*.controller.ts`,
   `*.service.ts`, `*.module.ts`, dan `dto/*.dto.ts`.
5. **Daftarkan modul** di `application/v1/v1.module.ts`.
6. **Seeder** — `resources/seeders/0N_nama.seeder.ts`, panggil dari runner.

## Aturan yang dipegang

- Controller tipis: DTO masuk → panggil service → bungkus `successResponse`.
  Tidak ada `if` bisnis di controller.
- Setiap field DTO wajib punya validator. `ValidationPipe` global memakai
  `whitelist + forbidNonWhitelisted`, jadi field tanpa dekorator ditolak.
- Nilai terbatas ditulis sekali sebagai `as const`, dipakai bersama di
  `@IsIn` dan `@ApiPropertyOptional`.
- `TYPEORM_SYNC=false`. Skema dikelola migrasi SQL. Menyalakan `synchronize`
  di atas tabel hasil migrasi membuat TypeORM drop+add kolom dan gagal pada
  tabel berisi data.
- Seeder selalu memeriksa `count()` dulu — aman dijalankan ulang.

## Autentikasi staf

Hanya staf yang punya akun; mahasiswa memakai SIA UT.

| Hal | Letak |
|---|---|
| Tabel | `m_staf` (migrasi `002_create_auth_staf.sql`) |
| Modul | `src/application/v1/auth/` |
| Endpoint | `GET /api/v1/auth/captcha`, `POST /api/v1/auth/login`, `POST /api/v1/auth/logout` |
| Akun demo | `admin@ecampus.ut.ac.id` / `DaakAdmin2026` dan `staf@ecampus.ut.ac.id` / `DaakStaf2026` |

Keputusan yang dipegang:

- **Captcha diverifikasi di server.** Jawabannya tidak pernah dikirim ke klien:
  payload token hanya memuat kedaluwarsa + nonce, sedangkan jawaban ikut
  ditandatangani HMAC. Verifikasi = hitung ulang tanda tangan memakai jawaban
  yang dikirim pengguna. Menaruh jawaban di dalam payload membuat captcha tak
  berarti — base64 bisa didekode siapa saja.
- **Satu token sekali pakai**, dicatat di memori sebelum jawaban dinilai, agar
  satu token tidak bisa ditebak berulang. Multi-instance nanti perlu Redis.
- **Pesan galat email-salah dan sandi-salah disamakan**, dan ada pembanding
  hash tiruan saat email tidak ditemukan supaya waktu prosesnya tidak
  membocorkan email mana yang terdaftar.
- **Token JWT dikirim sebagai cookie httpOnly**, bukan di badan respons —
  skrip halaman tidak bisa membacanya.
- **Rate limit** 5 percobaan login per menit, 30 captcha per menit, didaftarkan
  di `main.ts` bersama pembatas lain.
- **Ingat saya** memperpanjang masa sesi dari 30 menit (`JWT_EXPIRES_IN`)
  menjadi 7 hari (`JWT_REMEMBER_EXPIRES_IN`) — bukan membuatnya abadi, supaya
  perangkat yang hilang tidak menjadi pintu masuk permanen.
- `password_hash` diberi `select: false` di entity sehingga tidak ikut
  terbawa pada query biasa.

## Memagari endpoint

`AuthGuard` (`infrastructure/guards/auth.guard.ts`) membaca cookie httpOnly
`daak_token`, memverifikasi JWT, lalu menempelkan `req.pengguna`. Ambil di
controller dengan `@CurrentUser()`.

```ts
@UseGuards(AuthGuard)
@Controller('v1/dasbor')
export class DasborController { ... }
```

Header `Authorization: Bearer` tetap diterima sebagai jalur kedua supaya
pengujian lewat curl/Swagger tidak perlu memalsukan cookie.

`cookie-parser` dipasang di `main.ts` dengan **namespace import**
(`import * as cookieParser`) — tsconfig template tidak memakai
`esModuleInterop`, jadi default import-nya bernilai `undefined` saat runtime.

## Yang BELUM dipasang dari template

Template menyertakan lapisan akun lengkap: `users`, `roles`, `menu`,
`permissions`, `instansi`, guard RBAC, sesi Redis, dan tabel
`m_instansi`/`user`/`role`/`session`/`system_log`.

Login staf sudah ada (lihat bagian di atas), tetapi peran/izin per menu belum.
Selama endpoint portal masih publik dan baca-saja, lapisan itu belum diperlukan.
Bila nanti ada panel admin untuk mengelola pengumuman dan berita, salin
modul-modul tersebut dari template beserta migrasi `001_create_rbac_base_tables.sql`.

## Perintah

```bash
npm run start:dev   # http://localhost:3020, Swagger di /api-docs
npm run migrate     # jalankan berkas .sql yang belum pernah dijalankan
npm run seed        # isi tabel yang masih kosong
npm run typecheck   # tsc --noEmit
```
