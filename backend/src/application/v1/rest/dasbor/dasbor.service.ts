import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { MStatistikEntity } from '../../../../entities/m-statistik.entity';
import { TBeritaEntity } from '../../../../entities/t-berita.entity';
import { TPengumumanEntity } from '../../../../entities/t-pengumuman.entity';

/* Ringkasan dasbor dihitung DI BASIS DATA lewat GROUP BY, bukan dengan
   mengambil seluruh baris lalu menjumlahkannya di Node. Saat tabel tumbuh,
   yang berubah hanya waktu query — bukan jumlah data yang melintasi jaringan. */
@Injectable()
export class DasborService {
  constructor(
    @InjectRepository(TPengumumanEntity)
    private readonly pengumumanRepo: Repository<TPengumumanEntity>,
    @InjectRepository(TBeritaEntity)
    private readonly beritaRepo: Repository<TBeritaEntity>,
    @InjectRepository(MStatistikEntity)
    private readonly statistikRepo: Repository<MStatistikEntity>,
  ) {}

  async ringkasan() {
    const [
      totalPengumuman,
      totalBerita,
      perStatus,
      perKategori,
      statistik,
      pengumumanTerbaru,
      beritaTerbaru,
    ] = await Promise.all([
      this.pengumumanRepo.count({ where: { is_published: true } }),
      this.beritaRepo.count({ where: { is_published: true } }),

      this.pengumumanRepo
        .createQueryBuilder('p')
        .select('p.status', 'status')
        .addSelect('COUNT(*)::int', 'jumlah')
        .where('p.is_published = true')
        .andWhere('p.deleted_at IS NULL')
        .groupBy('p.status')
        .orderBy('jumlah', 'DESC')
        .getRawMany<{ status: string; jumlah: number }>(),

      this.beritaRepo
        .createQueryBuilder('b')
        .select('b.kategori', 'kategori')
        .addSelect('COUNT(*)::int', 'jumlah')
        .where('b.is_published = true')
        .andWhere('b.deleted_at IS NULL')
        .groupBy('b.kategori')
        .orderBy('jumlah', 'DESC')
        .getRawMany<{ kategori: string; jumlah: number }>(),

      this.statistikRepo.find({ order: { urutan: 'ASC' } }),

      this.pengumumanRepo.find({
        where: { is_published: true },
        order: { tanggal: 'DESC', id: 'DESC' },
        take: 5,
        select: ['id', 'judul', 'tanggal', 'status'],
      }),

      this.beritaRepo.find({
        where: { is_published: true },
        order: { tanggal: 'DESC', id: 'DESC' },
        take: 5,
        select: ['id', 'slug', 'judul', 'tanggal', 'kategori'],
      }),
    ]);

    return {
      kartu: {
        pengumuman: totalPengumuman,
        berita: totalBerita,
        statistik: statistik.length,
      },
      pengumuman_per_status: perStatus,
      berita_per_kategori: perKategori,
      statistik,
      terbaru: {
        pengumuman: pengumumanTerbaru,
        berita: beritaTerbaru,
      },
    };
  }
}
