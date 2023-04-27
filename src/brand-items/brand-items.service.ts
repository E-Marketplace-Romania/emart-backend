import { Injectable } from '@nestjs/common';
import { CreateBrandItemDto } from './dto/create-brand-item.dto';
import { UpdateBrandItemDto } from './dto/update-brand-item.dto';

@Injectable()
export class BrandItemsService {
  create(createBrandItemDto: CreateBrandItemDto) {
    return 'This action adds a new brandItem';
  }

  findAll() {
    return `This action returns all brandItems`;
  }

  findOne(id: number) {
    return `This action returns a #${id} brandItem`;
  }

  update(id: number, updateBrandItemDto: UpdateBrandItemDto) {
    return `This action updates a #${id} brandItem`;
  }

  remove(id: number) {
    return `This action removes a #${id} brandItem`;
  }
}
