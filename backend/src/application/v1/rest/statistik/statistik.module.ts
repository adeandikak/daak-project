import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MStatistikEntity } from '../../../../entities/m-statistik.entity';
import { StatistikController } from './statistik.controller';
import { StatistikService } from './statistik.service';

@Module({
  imports: [TypeOrmModule.forFeature([MStatistikEntity])],
  controllers: [StatistikController],
  providers: [StatistikService],
  exports: [StatistikService],
})
export class StatistikModule {}
