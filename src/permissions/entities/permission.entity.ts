import { Role } from 'src/role/entities/role.entity';
import { Column, Entity, ManyToMany, PrimaryColumn } from 'typeorm';

@Entity()
export class Permission {
  @PrimaryColumn()
  name: string;
  @Column({ nullable: true })
  description: string;
}
