import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';

import { TBeritaEntity } from '../../../../entities/t-berita.entity';
import { ListBeritaQueryDto } from './dto/berita.dto';

@Injectable()
export class BeritaService {
  constructor(
    @InjectRepository(TBeritaEntity)
    private readonly repo: Repository<TBeritaEntity>,
  ) {}

  async daftar(q: ListBeritaQueryDto) {
    const { limit = 3, kategori } = q;

    const [items, total] = await this.repo.findAndCount({
      where: {
        is_published: true,
        ...(kategori ? { kategori: ILike(kategori) } : {}),
      },
      order: { tanggal: 'DESC', id: 'DESC' },
      take: limit,
    });

    return { items, total };
  }

  async satu(slug: string): Promise<TBeritaEntity> {
    const item = await this.repo.findOne({ where: { slug, is_published: true } });

    if (!item) {
      throw new NotFoundException(`Berita "${slug}" tidak ditemukan`);
    }

    return item;
  }
}
