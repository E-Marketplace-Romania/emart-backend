import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Subcategory {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ unique: true, nullable: false })
  name: string;
  @Column()
  description: string;
}
