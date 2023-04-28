import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';
import { Permission } from '../../permissions/entities/permission.entity';

@Entity()
export class Role {
  @PrimaryColumn()
  name: string;
  @Column()
  description: string;
  @ManyToMany(() => Permission, { eager: false, cascade: true })
  @JoinTable({
    name: 'role_permissions',
  })
  permissions: Permission[];
}
