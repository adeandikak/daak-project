-- ============================================================
-- MIGRATION 001 — Tabel portal Beranda DAAK
--
-- Bentuk baku sebuah migrasi:
--   1. Nomor urut tiga digit + nama ringkas, satu berkas per modul/fase.
--   2. IF NOT EXISTS di mana-mana — migrasi harus aman dijalankan ulang.
--   3. Aturan data (CHECK, UNIQUE, FK) ditulis DI SINI, bukan hanya di
--      validator DTO. DTO menjaga satu pintu; basis data menjaga semuanya.
--   4. Perubahan pada tabel yang sudah ada memakai ALTER ... IF NOT EXISTS
--      atau DROP CONSTRAINT IF EXISTS + ADD, di berkas migrasi BARU.
-- ============================================================

-- ── m_statistik: angka ringkas UT (master, disunting bukan diarsipkan) ──
CREATE TABLE IF NOT EXISTS m_statistik (
    id          SERIAL PRIMARY KEY,
    label       VARCHAR(100)  NOT NULL UNIQUE,
    nilai       INT           NOT NULL,
    suffix      VARCHAR(8)    NULL,
    urutan      INT           NOT NULL DEFAULT 0,
    updated_by  VARCHAR(100)  NULL,
    updated_at  TIMESTAMP     NOT NULL DEFAULT NOW(),
    CONSTRAINT ck_statistik_nilai CHECK (nilai >= 0)
);

-- ── t_pengumuman: accordion pengumuman penting ──
CREATE TABLE IF NOT EXISTS t_pengumuman (
    id            SERIAL PRIMARY KEY,
    judul         VARCHAR(255)  NOT NULL,
    tanggal       DATE          NOT NULL,
    status        VARCHAR(20)   NOT NULL DEFAULT 'baru',
    isi           TEXT          NOT NULL,
    cta_label     VARCHAR(100)  NULL,
    cta_url       VARCHAR(255)  NULL,
    is_published  BOOLEAN       NOT NULL DEFAULT TRUE,
    created_by    VARCHAR(100)  NULL,
    created_at    TIMESTAMP     NOT NULL DEFAULT NOW(),
    updated_by    VARCHAR(100)  NULL,
    updated_at    TIMESTAMP     NOT NULL DEFAULT NOW(),
    deleted_at    TIMESTAMP     NULL,
    CONSTRAINT ck_pengumuman_status CHECK (status IN ('penting', 'baru', 'update')),
    -- Tombol panel: label dan URL harus ada berdua, atau tidak sama sekali
    CONSTRAINT ck_pengumuman_cta CHECK (
        (cta_label IS NULL AND cta_url IS NULL)
        OR (cta_label IS NOT NULL AND cta_url IS NOT NULL)
    )
);
CREATE INDEX IF NOT EXISTS idx_pengumuman_status  ON t_pengumuman(status);
CREATE INDEX IF NOT EXISTS idx_pengumuman_terbit  ON t_pengumuman(is_published);

-- ── t_berita: grid berita terbaru ──
CREATE TABLE IF NOT EXISTS t_berita (
    id             SERIAL PRIMARY KEY,
    slug           VARCHAR(160)  NOT NULL,
    judul          VARCHAR(255)  NOT NULL,
    ringkasan      TEXT          NOT NULL,
    tanggal        DATE          NOT NULL,
    kategori       VARCHAR(60)   NOT NULL,
    gradient_from  VARCHAR(9)    NOT NULL,
    gradient_to    VARCHAR(9)    NOT NULL,
    ikon           VARCHAR(40)   NOT NULL DEFAULT 'file-text',
    tautan_url     VARCHAR(255)  NOT NULL,
    is_published   BOOLEAN       NOT NULL DEFAULT TRUE,
    created_by     VARCHAR(100)  NULL,
    created_at     TIMESTAMP     NOT NULL DEFAULT NOW(),
    updated_by     VARCHAR(100)  NULL,
    updated_at     TIMESTAMP     NOT NULL DEFAULT NOW(),
    deleted_at     TIMESTAMP     NULL,
    -- Warna gradien wajib hex #RRGGBB — tampilan menyusunnya jadi linear-gradient
    CONSTRAINT ck_berita_gradient_from CHECK (gradient_from ~ '^#[0-9A-Fa-f]{6}$'),
    CONSTRAINT ck_berita_gradient_to   CHECK (gradient_to   ~ '^#[0-9A-Fa-f]{6}$')
);
CREATE UNIQUE INDEX IF NOT EXISTS idx_berita_slug     ON t_berita(slug);
CREATE INDEX        IF NOT EXISTS idx_berita_kategori ON t_berita(kategori);
CREATE INDEX        IF NOT EXISTS idx_berita_terbit   ON t_berita(is_published);
