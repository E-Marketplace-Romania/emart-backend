import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Permission } from './entities/permission.entity';
import { Repository } from 'typeorm';

Injectable();
export class PermisionsService {
  constructor(
    @InjectRepository(Permission)
    private permissionRepository: Repository<Permission>,
  ) {}

  create(createPermision: Permission) {
    return this.permissionRepository.save(createPermision);
  }

  createBatch(createPermisions: Permission[]) {
    return this.permissionRepository.save(createPermisions);
  }

  findAll() {
    return this.permissionRepository.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} permision`;
  }
}
