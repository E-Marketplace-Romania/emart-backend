import { Module } from '@nestjs/common';
import { PermisionsService } from './permisions.service';
import { PermisionsController } from './permisions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Permission } from './entities/permission.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Permission])],
  controllers: [PermisionsController],
  providers: [PermisionsService],
})
export class PermisionsModule {}
