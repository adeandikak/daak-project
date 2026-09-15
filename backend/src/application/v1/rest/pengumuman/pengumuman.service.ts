import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { TPengumumanEntity } from '../../../../entities/t-pengumuman.entity';
import { ListPengumumanQueryDto } from './dto/pengumuman.dto';

/* Service memegang aturan bisnis; controller tidak. Di modul ini aturannya
   sederhana: hanya yang terbit boleh tampil, dan urutannya terbaru dulu. */
@Injectable()
export class PengumumanService {
  constructor(
    @InjectRepository(TPengumumanEntity)
    private readonly repo: Repository<TPengumumanEntity>,
  ) {}

  async daftar(q: ListPengumumanQueryDto) {
    const { limit = 3, status } = q;

    const [items, total] = await this.repo.findAndCount({
      where: {
        is_published: true,
        ...(status ? { status } : {}),
      },
      order: { tanggal: 'DESC', id: 'DESC' },
      take: limit,
    });

    return { items, total };
  }

  async satu(id: number): Promise<TPengumumanEntity> {
    const item = await this.repo.findOne({ where: { id, is_published: true } });

    if (!item) {
      throw new NotFoundException(`Pengumuman ${id} tidak ditemukan`);
    }

    return item;
  }
}
