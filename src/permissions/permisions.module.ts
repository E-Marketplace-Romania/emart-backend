import { Module } from '@nestjs/common';
import { PermisionsService } from './permisions.service';
import { PermisionsController } from './permisions.controller';

@Module({
  controllers: [PermisionsController],
  providers: [PermisionsService],
})
export class PermisionsModule {}
