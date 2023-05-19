import { Module } from '@nestjs/common';
import { ScraperService } from './scraper.service';
import { ScraperController } from './scraper.controller';
import { ListingModule } from 'src/listing/listing.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Scraper } from './entities/scraper.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Scraper]), ListingModule],
  controllers: [ScraperController],
  providers: [ScraperService],
})
export class ScraperModule {}
