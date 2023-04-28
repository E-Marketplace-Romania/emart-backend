import { Rating } from 'src/rating/entities/rating.entity';
import { Role } from 'src/role/entities/role.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

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
  salt: string;
  @OneToMany(() => Rating, (rating) => rating.user)
  rated: Rating[];
  @Column({ default: 0 })
  rating: number;
  @OneToMany(() => Rating, (rating) => rating.userRated)
  ratings: Rating[];
  @OneToOne(() => Role, (role) => role.name, { cascade: true })
  @JoinColumn()
  role: Role;
  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
