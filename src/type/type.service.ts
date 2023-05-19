import { Injectable } from '@nestjs/common';
import { CreateTypeDto } from './dto/create-type.dto';
import { UpdateTypeDto } from './dto/update-type.dto';
import { Type } from './entities/type.entity';

@Injectable()
export class TypeService {
  create(createTypeDto: CreateTypeDto) {
    return 'This action adds a new type';
  }

  findAll() {
    return `This action returns all type`;
  }

  async findOne(id: string): Promise<Type> {
    return;
  }

  update(id: string, updateTypeDto: UpdateTypeDto) {
    return `This action updates a #${id} type`;
  }

  remove(id: string) {
    return `This action removes a #${id} type`;
  }
}
