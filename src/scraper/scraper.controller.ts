import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { ScraperService } from './scraper.service';
import { CreateScraperDto } from './dto/create-scraper.dto';

@Controller('scraper')
export class ScraperController {
  constructor(private readonly scraperService: ScraperService) {}

  @Post()
  create(@Body() createScraperDto: CreateScraperDto) {
    return this.scraperService.create(createScraperDto);
  }

  @Get()
  findAll() {
    return this.scraperService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.scraperService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.scraperService.remove(id);
  }

  @Post('scrape')
  scrape() {
    return this.scraperService.scrapeOlx();
  }
}
