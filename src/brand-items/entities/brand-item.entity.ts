import { Brand } from 'src/brand/entities/brand.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class BrandItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ unique: true, nullable: false })
  name: string;
  @Column()
  description: string;
  @ManyToOne(() => Brand, (brand) => brand.brandItems)
  brand: Brand;
}
