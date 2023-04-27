import { Module } from '@nestjs/common';
import { BrandItemsService } from './brand-items.service';
import { BrandItemsController } from './brand-items.controller';

@Module({
  controllers: [BrandItemsController],
  providers: [BrandItemsService]
})
export class BrandItemsModule {}
