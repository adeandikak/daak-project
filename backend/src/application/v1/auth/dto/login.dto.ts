import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsEmail, IsInt, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { Type as TransformType } from 'class-transformer';

/* DTO = kontrak pintu masuk. ValidationPipe global memakai
   `whitelist + forbidNonWhitelisted`, jadi field tanpa dekorator DITOLAK.

   Batas panjang bukan sekadar kerapian: tanpa @MaxLength, kata sandi
   sepanjang megabyte tetap masuk ke bcrypt dan membakar CPU. */
export class LoginDto {
  @ApiProperty({ example: 'staf@ecampus.ut.ac.id' })
  @IsEmail({}, { message: 'Format email tidak valid' })
  @MaxLength(160)
  email: string;

  @ApiProperty({ example: 'RahasiaStaf123' })
  @IsString()
  @MinLength(8, { message: 'Kata sandi minimal 8 karakter' })
  @MaxLength(72) // bcrypt hanya membaca 72 byte pertama
  password: string;

  @ApiProperty({
    description: 'Token captcha dari GET /api/v1/auth/captcha',
  })
  @IsString()
  @MaxLength(256)
  captcha_token: string;

  @ApiProperty({ example: 12, description: 'Hasil penjumlahan yang ditampilkan' })
  @TransformType(() => Number)
  @IsInt({ message: 'Jawaban captcha harus berupa angka' })
  captcha_jawaban: number;

  @ApiPropertyOptional({
    default: false,
    description: 'Perpanjang masa sesi pada perangkat ini',
  })
  @IsOptional()
  @IsBoolean()
  ingat?: boolean = false;
}
