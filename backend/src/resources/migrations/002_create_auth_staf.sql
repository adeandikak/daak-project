-- ============================================================
-- MIGRATION 002 — Akun staf DAAK
-- Jalankan setelah 001.
--
-- Hanya staf yang punya akun di portal ini; mahasiswa memakai SIA UT.
-- Kata sandi TIDAK PERNAH disimpan apa adanya — kolomnya menyimpan hash
-- bcrypt, dan panjangnya dipatok 60 sesuai keluaran bcrypt.
-- ============================================================

CREATE TABLE IF NOT EXISTS m_staf (
    id            SERIAL PRIMARY KEY,
    nama          VARCHAR(120)  NOT NULL,
    email         VARCHAR(160)  NOT NULL,
    password_hash CHAR(60)      NOT NULL,
    jabatan       VARCHAR(120)  NULL,
    is_active     BOOLEAN       NOT NULL DEFAULT TRUE,
    last_login_at TIMESTAMP     NULL,
    created_by    VARCHAR(100)  NULL,
    created_at    TIMESTAMP     NOT NULL DEFAULT NOW(),
    updated_by    VARCHAR(100)  NULL,
    updated_at    TIMESTAMP     NOT NULL DEFAULT NOW(),
    deleted_at    TIMESTAMP     NULL,
    -- Email dinormalkan ke huruf kecil sebelum disimpan; CHECK menjaga
    -- agar baris yang lolos lewat jalur lain tetap konsisten.
    CONSTRAINT ck_staf_email_lower CHECK (email = lower(email)),
    CONSTRAINT ck_staf_email_bentuk CHECK (email ~ '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$')
);

-- Unik hanya untuk baris yang belum dihapus, supaya email bekas akun
-- terhapus boleh dipakai lagi.
CREATE UNIQUE INDEX IF NOT EXISTS idx_staf_email
    ON m_staf(email) WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_staf_aktif ON m_staf(is_active);
