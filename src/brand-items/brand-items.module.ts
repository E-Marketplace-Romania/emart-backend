import { Module } from '@nestjs/common';
import { BrandItemsService } from './brand-items.service';
import { BrandItemsController } from './brand-items.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BrandItem } from './entities/brand-item.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BrandItem])],
  controllers: [BrandItemsController],
  providers: [BrandItemsService],
})
export class BrandItemsModule {}
