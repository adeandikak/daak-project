import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TBeritaEntity } from '../../../../entities/t-berita.entity';
import { BeritaController } from './berita.controller';
import { BeritaService } from './berita.service';

@Module({
  imports: [TypeOrmModule.forFeature([TBeritaEntity])],
  controllers: [BeritaController],
  providers: [BeritaService],
  exports: [BeritaService],
})
export class BeritaModule {}
