import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MStatistikEntity } from '../../../../entities/m-statistik.entity';
import { TBeritaEntity } from '../../../../entities/t-berita.entity';
import { TPengumumanEntity } from '../../../../entities/t-pengumuman.entity';
import { DasborController } from './dasbor.controller';
import { DasborService } from './dasbor.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([TPengumumanEntity, TBeritaEntity, MStatistikEntity]),
  ],
  controllers: [DasborController],
  providers: [DasborService],
  exports: [DasborService],
})
export class DasborModule {}
