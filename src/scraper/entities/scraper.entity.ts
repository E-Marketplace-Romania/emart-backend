import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('scraped_listings')
export class Scraper {
  @PrimaryColumn()
  id: string;
  @Column({ nullable: true })
  name: string;
  @Column({ nullable: true })
  price: string;
  @Column({ nullable: true })
  location: string;
  @Column({ nullable: true })
  category: string;
  @Column({ nullable: true })
  description: string;
  @Column({ nullable: true })
  url: string;
  @Column({ nullable: true })
  image: string;
  @Column({ nullable: true })
  platform: string;
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
  @Column({ nullable: true })
  postedAt: string;
  @Column({ nullable: true })
  memory: string;
  @Column({ nullable: true })
  storage: string;
  @Column({ nullable: true })
  make: string;
  @Column({ nullable: true })
  model: string;
  @Column({ nullable: true })
  powerSpec: string;
  @Column({ nullable: true })
  otherSpec: string;
  @Column({ nullable: true })
  memoryType: string;
}
