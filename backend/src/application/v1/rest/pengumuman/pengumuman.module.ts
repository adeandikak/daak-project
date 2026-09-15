import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TPengumumanEntity } from '../../../../entities/t-pengumuman.entity';
import { PengumumanController } from './pengumuman.controller';
import { PengumumanService } from './pengumuman.service';

/* Satu modul = satu folder = satu urusan. forFeature hanya mendaftarkan
   entity yang dipakai service ini. */
@Module({
  imports: [TypeOrmModule.forFeature([TPengumumanEntity])],
  controllers: [PengumumanController],
  providers: [PengumumanService],
  exports: [PengumumanService],
})
export class PengumumanModule {}
