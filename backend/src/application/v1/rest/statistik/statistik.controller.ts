import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { successResponse } from '../../../../commons/response/response.util';
import { StatistikService } from './statistik.service';

@ApiTags('Statistik')
@Controller('v1/statistik')
export class StatistikController {
  constructor(private readonly svc: StatistikService) {}

  @Get()
  @ApiOperation({ summary: 'Angka ringkas UT — blok counter Beranda' })
  async daftar() {
    const r = await this.svc.daftar();
    return successResponse(r.items, `${r.total} angka statistik`);
  }
}
