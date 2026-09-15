import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional, Max, Min } from 'class-validator';

/* DTO = kontrak pintu masuk. ValidationPipe global memakai
   `whitelist + forbidNonWhitelisted`, jadi field tanpa dekorator DITOLAK.
   Nilai terbatas ditulis sekali sebagai konstanta `as const` lalu dipakai
   bersama di @IsIn dan @ApiPropertyOptional — satu daftar, bukan dua. */

export const STATUS_PENGUMUMAN = ['penting', 'baru', 'update'] as const;

export class ListPengumumanQueryDto {
  @ApiPropertyOptional({ default: 3, minimum: 1, maximum: 50 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  limit?: number = 3;

  @ApiPropertyOptional({ enum: STATUS_PENGUMUMAN })
  @IsOptional()
  @IsIn(STATUS_PENGUMUMAN as unknown as string[])
  status?: string;
}
