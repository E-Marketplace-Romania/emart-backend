import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { BrandItemsService } from './brand-items.service';
import { CreateBrandItemDto } from './dto/create-brand-item.dto';
import { UpdateBrandItemDto } from './dto/update-brand-item.dto';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';

@Controller('brand-items')
@Roles(['ADMIN'])
@UseGuards(RolesGuard)
export class BrandItemsController {
  constructor(private readonly brandItemsService: BrandItemsService) {}

  @Post()
  create(@Body() createBrandItemDto: CreateBrandItemDto) {
    return this.brandItemsService.create(createBrandItemDto);
  }

  @Get()
  findAll() {
    return this.brandItemsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.brandItemsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateBrandItemDto: UpdateBrandItemDto,
  ) {
    return this.brandItemsService.update(+id, updateBrandItemDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.brandItemsService.remove(+id);
  }
}
