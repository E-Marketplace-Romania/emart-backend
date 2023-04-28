import { User } from 'src/user/entities/user.entity';
import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Rating {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @ManyToOne(() => User, (user) => user.rated)
  user: User;
  @ManyToOne(() => User, (user) => user.ratings)
  userRated: User;
}
