import { Brand } from 'src/brand/entities/brand.entity';
import { Category } from 'src/category/entities/category.entity';
import { Subcategory } from 'src/subcategory/entities/subcategory.entity';
import { Type } from 'src/type/entities/type.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Listing {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ unique: true })
  externalId: string;
  @Column()
  title: string;
  @Column()
  description: string;
  @Column()
  price: number;
  @Column()
  location: string;
  @OneToOne(() => Category)
  category: Category;
  @OneToOne(() => Subcategory)
  subcategory: Subcategory;
  @OneToOne(() => Type)
  type: Type;
  @OneToOne(() => Brand)
  brand: Brand;
  @ManyToOne(() => User, (user) => user.listings)
  user: User;
}
