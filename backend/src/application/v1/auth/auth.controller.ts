import { Body, Controller, Get, HttpCode, HttpStatus, Post, Res, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

import { successResponse } from '../../../commons/response/response.util';
import { CurrentUser } from '../../../infrastructure/decorators/current-user.decorator';
import { AuthGuard, type PenggunaSesi } from '../../../infrastructure/guards/auth.guard';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

/* Controller tipis: DTO masuk, panggil service, bungkus respons.
   Token dikirim sebagai cookie httpOnly, bukan di badan respons — skrip di
   halaman tidak bisa membacanya, sehingga XSS tidak langsung berarti
   pencurian sesi. Profil ringkas tetap dikembalikan untuk ditampilkan. */
@ApiTags('Auth')
@Controller('v1/auth')
export class AuthController {
  constructor(private readonly svc: AuthService) {}

  @Get('captcha')
  @ApiOperation({ summary: 'Terbitkan soal penjumlahan beserta token bertanda tangan' })
  captcha() {
    const r = this.svc.terbitkanCaptcha();
    return successResponse(r, 'Captcha diterbitkan');
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Masuk sebagai staf DAAK' })
  async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response) {
    const r = await this.svc.login(dto);

    res.cookie('daak_token', r.token, {
      httpOnly: true,
      sameSite: 'lax',
      // Secure hanya di produksi — di localhost koneksi masih http
      secure: process.env.APP_ENV === 'production',
      maxAge: r.kedaluwarsaDetik * 1000,
      path: '/',
    });

    return successResponse({ staf: r.staf }, `Selamat datang, ${r.staf.nama}`);
  }

  @Get('me')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Profil staf dari sesi aktif — dipakai memulihkan sesi di klien' })
  async me(@CurrentUser() pengguna: PenggunaSesi) {
    const staf = await this.svc.profil(pengguna.id);
    return successResponse({ staf }, 'Sesi aktif');
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Keluar — hapus cookie sesi' })
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('daak_token', { path: '/' });
    return successResponse(null, 'Anda telah keluar');
  }
}
