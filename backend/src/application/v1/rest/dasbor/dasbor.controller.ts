import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { successResponse } from '../../../../commons/response/response.util';
import { AuthGuard } from '../../../../infrastructure/guards/auth.guard';
import { DasborService } from './dasbor.service';

/* Seluruh endpoint di sini DIPAGARI AuthGuard. Angka ringkasan memang berasal
   dari data publik, tetapi dasbor adalah ruang kerja staf — memagarinya di
   server berarti menyembunyikan menu di klien bukan satu-satunya penjaga. */
@ApiTags('Dasbor')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('v1/dasbor')
export class DasborController {
  constructor(private readonly svc: DasborService) {}

  @Get('ringkasan')
  @ApiOperation({ summary: 'Angka ringkas, sebaran, dan daftar terbaru untuk dasbor staf' })
  async ringkasan() {
    const r = await this.svc.ringkasan();
    return successResponse(r, 'Ringkasan dasbor');
  }
}
