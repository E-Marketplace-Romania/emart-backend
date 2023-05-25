import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { PermisionsService } from './permisions.service';
import { Permission } from './entities/permission.entity';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';

@Roles(['ADMIN'])
@UseGuards(RolesGuard)
@Controller('permissions')
export class PermisionsController {
  constructor(private readonly permisionsService: PermisionsService) {}

  @Get()
  async findAll(): Promise<Permission[]> {
    return await this.permisionsService.findAll();
  }

  @Post()
  async create(@Body() permission: Permission): Promise<Permission> {
    return await this.permisionsService.create(permission);
  }

  @Post('batch')
  async createBatch(@Body() permissions: Permission[]): Promise<Permission[]> {
    return await this.permisionsService.createBatch(permissions);
  }
}
