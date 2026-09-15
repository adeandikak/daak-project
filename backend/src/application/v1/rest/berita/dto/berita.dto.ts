import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator';

export class ListBeritaQueryDto {
  @ApiPropertyOptional({ default: 3, minimum: 1, maximum: 24 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(24)
  limit?: number = 3;

  @ApiPropertyOptional({ example: 'Layanan' })
  @IsOptional()
  @IsString()
  @MaxLength(60)
  kategori?: string;
}
