import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
} from '@nestjs/common';
import { ScraperService, OkaziiCategory, OlxCategory } from './scraper.service';
import { Roles } from 'src/auth/roles.decorator';

@Controller('scraper')
export class ScraperController {
  categoryMap = {
    'placa-video': ['placi-video', 'placa-video'],
    'placa-baza': ['placi-de-baza', 'placa-de-baza'],
    surse: ['surse-pc', 'surse'],
    'placa-de-sunet': ['placi-de-sunet', 'placa-de-sunet'],
    'coolere-ventilatoare': [
      'coolere-si-ventilatoare-pc',
      'coolere-ventilatoare',
    ],
    carcase: ['carcase-pc', 'carcasa'],
    procesor: ['procesoare', 'procesor'],
    'memorie-ram': ['memorii-ram', 'memorie-ram'],
    'hard-disk': ['hard-disk-uri', 'hard-disk'],
    ssd: ['ssd'],
  };

  constructor(private readonly scraperService: ScraperService) {}

  @Get()
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit = 20,
    @Query('category') category = 'toate',
  ) {
    let categories: string[] = [];
    if (category !== 'toate') {
      categories = this.categoryMap[category];
    }

    console.log(categories);
    console.log(category);

    return this.scraperService.findAll(
      {
        page,
        limit,
        route: 'http://localhost:3000/scraper',
      },
      categories,
    );
  }

  @Roles(['ADMIN'])
  @Post('scrape-olx')
  scrape(@Body() body: { scrapePages: number; category: OlxCategory }) {
    return this.scraperService.scrapeOlx(body.scrapePages, body.category);
  }

  @Roles(['ADMIN'])
  @Post('scrape-okazii')
  scrapeOkazii(
    @Body() body: { scrapePages: number; category: OkaziiCategory },
  ) {
    return this.scraperService.scrapeOkazii(body.scrapePages, body.category);
  }

  @Roles(['ADMIN'])
  @Post('scrape-all')
  scrapeAll() {
    return this.scraperService.runScrapes();
  }

  @Roles(['ADMIN'])
  @Post('correct-scrapes')
  correctScrapes() {
    return this.scraperService.correctSpecs();
  }
}
