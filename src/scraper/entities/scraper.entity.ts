import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('scraped_listings')
export class Scraper {
  @PrimaryColumn()
  id: string;
  @Column()
  name: string;
  @Column()
  price: number;
  @Column()
  location: string;
  @Column()
  category: string;
  @Column()
  description: string;
  @Column()
  url: string;
  @Column()
  image: string;
  @Column()
  platform: string;
  @Column()
  dateScraped: Date;
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
