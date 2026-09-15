import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { createHmac, randomInt, timingSafeEqual } from 'crypto';
import * as jwt from 'jsonwebtoken';
import { Repository } from 'typeorm';

import { MStafEntity } from '../../../entities/m-staf.entity';
import { LoginDto } from './dto/login.dto';

/** Umur token captcha. Cukup untuk mengisi formulir, terlalu pendek untuk disimpan. */
const CAPTCHA_TTL_MS = 5 * 60 * 1000;

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(MStafEntity)
    private readonly stafRepo: Repository<MStafEntity>,
  ) {}

  /* Token captcha yang sudah dipakai. Sebuah token bertanda tangan tetap sah
     sampai kedaluwarsa, jadi tanpa catatan ini satu jawaban benar bisa
     dipakai berulang untuk membombardir endpoint login. Set di memori cukup
     untuk satu proses; bila nanti berjalan multi-instance, pindahkan ke Redis. */
  private readonly captchaTerpakai = new Map<string, number>();

  private get rahasia(): string {
    const s = process.env.JWT_SECRET;

    if (!s || s.length < 32) {
      // Gagal keras, bukan diam-diam memakai kunci lemah
      throw new Error('JWT_SECRET belum diisi atau kurang dari 32 karakter');
    }

    return s;
  }

  private tandaTangan(data: string): string {
    return createHmac('sha256', this.rahasia).update(data).digest('base64url');
  }

  /** Bandingkan tanda tangan dalam waktu tetap — cegah timing attack. */
  private tandaTanganCocok(a: string, b: string): boolean {
    const ba = Buffer.from(a);
    const bb = Buffer.from(b);
    return ba.length === bb.length && timingSafeEqual(ba, bb);
  }

  private bersihkanCaptchaKedaluwarsa(): void {
    const sekarang = Date.now();

    for (const [token, exp] of this.captchaTerpakai) {
      if (exp < sekarang) this.captchaTerpakai.delete(token);
    }
  }

  /**
   * Terbitkan soal penjumlahan beserta token bertanda tangan.
   *
   * Jawabannya TIDAK ikut di dalam token. Payload hanya memuat waktu
   * kedaluwarsa dan nonce; jawaban cuma turut ditandatangani. Verifikasi
   * dilakukan dengan menghitung ulang tanda tangan memakai jawaban yang
   * dikirim pengguna — kalau cocok, berarti jawabannya benar.
   *
   * Ini penting: payload base64 bisa didekode siapa saja. Menaruh jawaban di
   * sana membuat captcha tidak ada artinya, karena bot cukup membaca token
   * alih-alih menjumlah.
   */
  terbitkanCaptcha(): { pertanyaan: string; token: string; kedaluwarsa: string } {
    // Angka satu digit sampai 9 — mudah dijumlah orang, tetap acak
    const a = randomInt(1, 10);
    const b = randomInt(1, 10);
    const exp = Date.now() + CAPTCHA_TTL_MS;

    const payload = Buffer.from(
      JSON.stringify({ exp, n: randomInt(1e9) }),
    ).toString('base64url');

    return {
      pertanyaan: `${a} + ${b}`,
      token: `${payload}.${this.tandaTangan(`${payload}.${a + b}`)}`,
      kedaluwarsa: new Date(exp).toISOString(),
    };
  }

  /** Profil staf untuk memulihkan sesi di sisi klien. */
  async profil(id: number) {
    const staf = await this.stafRepo.findOne({
      where: { id, is_active: true },
      select: ['id', 'nama', 'email', 'jabatan'],
    });

    if (!staf) {
      // Akun dinonaktifkan/dihapus setelah token terbit — sesi tidak lagi sah
      throw new UnauthorizedException('Akun tidak aktif. Silakan masuk kembali.');
    }

    return staf;
  }

  /** Lempar BadRequest bila captcha salah, kedaluwarsa, palsu, atau diulang. */
  private periksaCaptcha(token: string, jawaban: number): void {
    this.bersihkanCaptchaKedaluwarsa();

    const [payload, tanda] = token.split('.');

    if (!payload || !tanda) {
      throw new BadRequestException('Captcha tidak sah. Muat ulang soal.');
    }

    let isi: { exp: number };

    try {
      isi = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    } catch {
      throw new BadRequestException('Captcha tidak sah. Muat ulang soal.');
    }

    if (typeof isi?.exp !== 'number' || Date.now() > isi.exp) {
      throw new BadRequestException('Captcha kedaluwarsa. Muat ulang soal.');
    }

    if (this.captchaTerpakai.has(token)) {
      throw new BadRequestException('Captcha sudah dipakai. Muat ulang soal.');
    }

    /* Token dicatat terpakai SEBELUM jawaban dinilai. Kalau dicatat setelahnya,
       token yang sama bisa dicoba berulang dengan tebakan berbeda sampai tembus. */
    this.captchaTerpakai.set(token, isi.exp);

    const diharapkan = this.tandaTangan(`${payload}.${jawaban}`);

    if (!this.tandaTanganCocok(tanda, diharapkan)) {
      throw new BadRequestException('Jawaban penjumlahan salah.');
    }
  }

  /**
   * Masuk sebagai staf. Mengembalikan token JWT dan profil ringkas.
   *
   * Pesan galat email-salah dan sandi-salah sengaja DISAMAKAN: pesan yang
   * berbeda memberi tahu penyerang email mana yang terdaftar.
   */
  async login(dto: LoginDto): Promise<{
    token: string;
    kedaluwarsaDetik: number;
    staf: { id: number; nama: string; email: string; jabatan: string | null };
  }> {
    this.periksaCaptcha(dto.captcha_token, dto.captcha_jawaban);

    const email = dto.email.trim().toLowerCase();

    const staf = await this.stafRepo
      .createQueryBuilder('s')
      .addSelect('s.password_hash')
      .where('s.email = :email', { email })
      .getOne();

    const hashPembanding =
      staf?.password_hash ??
      // Hash tiruan agar waktu proses tetap sama saat email tidak ditemukan;
      // tanpa ini, respons cepat = "email tidak terdaftar".
      '$2a$10$invalidinvalidinvalidinvalidinvalidinvalidinvalidinvalidinv';

    const cocok = await bcrypt.compare(dto.password, hashPembanding);

    if (!staf || !cocok) {
      throw new UnauthorizedException('Email atau kata sandi salah.');
    }

    if (!staf.is_active) {
      throw new UnauthorizedException('Akun Anda dinonaktifkan. Hubungi administrator.');
    }

    /* "Ingat saya" memperpanjang sesi, bukan membuatnya abadi. Batas atasnya
       tetap ada supaya perangkat yang hilang tidak jadi pintu masuk permanen. */
    const kedaluwarsaDetik = dto.ingat
      ? Number(process.env.JWT_REMEMBER_EXPIRES_IN ?? 7 * 24 * 60 * 60)
      : Number(process.env.JWT_EXPIRES_IN ?? 1800);

    const token = jwt.sign(
      { sub: staf.id, email: staf.email, peran: 'staf' },
      this.rahasia,
      { expiresIn: kedaluwarsaDetik },
    );

    await this.stafRepo.update(staf.id, { last_login_at: new Date() });

    return {
      token,
      kedaluwarsaDetik,
      staf: {
        id: staf.id,
        nama: staf.nama,
        email: staf.email,
        jabatan: staf.jabatan,
      },
    };
  }
}
