import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Permission } from '../../permissions/entities/permission.entity';

@Entity()
export class Role {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  name: string;
  @Column()
  description: string;
  @OneToMany(() => Permission, (permission) => permission.id)
  permissions: string[];
}
