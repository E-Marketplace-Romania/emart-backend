import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Permission {
  @PrimaryColumn()
  name: string;
  @Column({ nullable: true })
  description: string;
}
