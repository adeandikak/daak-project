import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import * as jwt from 'jsonwebtoken';

export interface PenggunaSesi {
  id: number;
  email: string;
  peran: string;
}

/* Guard sesi staf. Token dibaca dari cookie httpOnly `daak_token`, bukan dari
   header Authorization — skrip halaman tidak pernah memegang tokennya, jadi
   tidak ada yang bisa disuntikkan dari sisi klien.

   Header Authorization tetap diterima sebagai jalur kedua supaya pengujian
   lewat curl/Swagger tidak perlu memalsukan cookie. */
@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<Request>();
    const token = this.ambilToken(req);

    if (!token) {
      throw new UnauthorizedException('Sesi tidak ditemukan. Silakan masuk kembali.');
    }

    const rahasia = process.env.JWT_SECRET;

    if (!rahasia || rahasia.length < 32) {
      throw new Error('JWT_SECRET belum diisi atau kurang dari 32 karakter');
    }

    try {
      const isi = jwt.verify(token, rahasia) as jwt.JwtPayload;

      (req as Request & { pengguna: PenggunaSesi }).pengguna = {
        id: Number(isi.sub),
        email: String(isi.email),
        peran: String(isi.peran),
      };

      return true;
    } catch {
      // Kedaluwarsa maupun tanda tangan salah diperlakukan sama
      throw new UnauthorizedException('Sesi berakhir. Silakan masuk kembali.');
    }
  }

  private ambilToken(req: Request): string | null {
    const dariCookie = (req as Request & { cookies?: Record<string, string> })
      .cookies?.daak_token;

    if (dariCookie) return dariCookie;

    const header = req.headers.authorization;
    if (header?.startsWith('Bearer ')) return header.slice(7);

    return null;
  }
}
