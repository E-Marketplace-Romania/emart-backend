import { Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Listing {
  @PrimaryGeneratedColumn('uuid')
  id: string;
}
