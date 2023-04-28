import { BrandItem } from 'src/brand-items/entities/brand-item.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Brand {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ unique: true, nullable: false })
  name: string;
  @Column()
  description: string;
  @OneToMany(() => BrandItem, (brandItem) => brandItem.id)
  brandItems: BrandItem[];
}
