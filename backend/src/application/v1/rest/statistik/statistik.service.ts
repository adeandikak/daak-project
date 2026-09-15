import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { MStatistikEntity } from '../../../../entities/m-statistik.entity';

@Injectable()
export class StatistikService {
  constructor(
    @InjectRepository(MStatistikEntity)
    private readonly repo: Repository<MStatistikEntity>,
  ) {}

  /** Seluruh angka counter, urut sesuai kolom `urutan`. */
  async daftar() {
    const items = await this.repo.find({ order: { urutan: 'ASC' } });
    return { items, total: items.length };
  }
}
