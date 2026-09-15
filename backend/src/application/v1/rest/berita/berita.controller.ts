import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { successResponse } from '../../../../commons/response/response.util';
import { BeritaService } from './berita.service';
import { ListBeritaQueryDto } from './dto/berita.dto';

@ApiTags('Berita')
@Controller('v1/berita')
export class BeritaController {
  constructor(private readonly svc: BeritaService) {}

  @Get()
  @ApiOperation({ summary: 'Daftar berita terbit — grid tiga kolom Beranda' })
  async daftar(@Query() q: ListBeritaQueryDto) {
    const r = await this.svc.daftar(q);
    return successResponse(r.items, `${r.total} berita`);
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Rincian berita berdasarkan slug' })
  async satu(@Param('slug') slug: string) {
    const r = await this.svc.satu(slug);
    return successResponse(r, r.judul);
  }
}
