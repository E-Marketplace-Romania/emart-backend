import { Rating } from 'src/rating/entities/rating.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  firstName: string;
  @Column()
  lastName: string;
  @Column({ unique: true })
  email: string;
  @Column({ nullable: false })
  password: string;
  @Column({ nullable: false })
  role: string;
  @OneToMany(() => Rating, (rating) => rating.user)
  rated: Rating[];
  rating: number;
  @OneToMany(() => Rating, (rating) => rating.userRated)
  ratings: Rating[];
  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
