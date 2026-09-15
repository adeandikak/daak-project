import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { successResponse } from '../../../../commons/response/response.util';
import { ListPengumumanQueryDto } from './dto/pengumuman.dto';
import { PengumumanService } from './pengumuman.service';

/* Controller tipis: DTO masuk, panggil service, bungkus respons. Tidak ada
   `if` bisnis di sini. Pesan sukses ditulis seperti kalimat yang akan
   dibaca orang, bukan "OK".

   Endpoint portal bersifat publik — belum ada AuthGuard/RolesGuard seperti
   modul bertautan pengguna di template. */
@ApiTags('Pengumuman')
@Controller('v1/pengumuman')
export class PengumumanController {
  constructor(private readonly svc: PengumumanService) {}

  @Get()
  @ApiOperation({ summary: 'Daftar pengumuman terbit — accordion Beranda' })
  async daftar(@Query() q: ListPengumumanQueryDto) {
    const r = await this.svc.daftar(q);
    return successResponse(r.items, `${r.total} pengumuman`);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Rincian satu pengumuman' })
  async satu(@Param('id', ParseIntPipe) id: number) {
    const r = await this.svc.satu(id);
    return successResponse(r, r.judul);
  }
}
