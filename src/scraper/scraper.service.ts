import { Injectable, Logger } from '@nestjs/common';
import { CreateScraperDto } from './dto/create-scraper.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Scraper } from './entities/scraper.entity';
import { Repository } from 'typeorm';
import puppeteer, { Page } from 'puppeteer';
import { last } from 'rxjs';

// https://www.olx.ro/electronice-si-electrocasnice/componente-laptop-pc/{category}/?currency=RON&page={pageNum} exemplu url olx
/**
 * LISTA CATEGORII OLX
 * /placi-video/
 * /placi-de-baza/
 * /surse-pc/
 * /placi-de-sunet/
 * /coolere-si-ventilatoare-pc/
 * /carcase-pc/
 * /procesoare/
 * /placi-de-baza/
 * /memorii-ram/
 * /hard-disk-uri/
 */

type OlxCategory =
  | 'placi-video'
  | 'placi-de-baza'
  | 'surse-pc'
  | 'placi-de-sunet'
  | 'coolere-si-ventilatoare-pc'
  | 'carcase-pc'
  | 'procesoare'
  | 'placi-de-baza'
  | 'memorii-ram'
  | 'hard-disk-uri';

type OlxCategoryValues = keyof { [K in OlxCategory]: K };

@Injectable()
export class ScraperService {
  constructor(
    @InjectRepository(Scraper) private scraperRepository: Repository<Scraper>,
  ) {}
  async create(createScraperDto: CreateScraperDto): Promise<Scraper> {
    return await this.scraperRepository.save(createScraperDto);
  }

  findAll() {
    return this.scraperRepository.find();
  }

  findOne(id: string) {
    return this.scraperRepository.findOneBy({
      id,
    });
  }

  remove(id: string) {
    return this.scraperRepository.delete({
      id,
    });
  }

  getOlxCategories() {
    return Object.keys({} as OlxCategoryValues);
  }

  private async autoScroll(page: Page) {
    await page.evaluate(async () => {
      await new Promise<void>((resolve) => {
        let totalHeight = 0;
        const distance = 100;
        const timer = setInterval(() => {
          const scrollHeight = document.body.scrollHeight;
          window.scrollBy(0, distance);
          totalHeight += distance;

          if (totalHeight >= scrollHeight - window.innerHeight) {
            clearInterval(timer);
            resolve();
          }
        }, 100);
      });
    });
  }

  async scrapeOlx(scrapePages: number, category: OlxCategory) {
    const browser = await puppeteer.launch({
      headless: true,
    });

    const URL = `https://www.olx.ro/electronice-si-electrocasnice/componente-laptop-pc/${category}/?currency=RON`;
    const data = {};
    try {
      const page = await browser.newPage();
      await page.goto(URL, { waitUntil: 'networkidle0' });
      await page.setViewport({ width: 1920, height: 1080 });
      // Get the HTML element and extract the desired data
      const pages = await page.$$('.css-1mi714g');
      const lastPage = await pages[pages.length - 1].evaluate(
        (el) => el.textContent,
      );
      await this.autoScroll(page);

      for (let i = 1; i <= parseInt(lastPage); i++) {
        console.log(`page ${i}`);
        if (i >= 2) {
          await page.goto(`${URL}&page=${i}`, { waitUntil: 'networkidle0' });
          await this.autoScroll(page);
        }

        const elements = await page.$$('div[data-cy="l-card"]');

        for (const element of elements) {
          const id = await element.evaluate((el) => el.id);
          const hrefEl = await element.$('a.css-rc5s2u');
          const href = await hrefEl.evaluate((el) => el.href);

          const parentImgElement = await element.$('div.css-gl6djm');
          const imgElement = await parentImgElement.$('img');
          let imgSrc: string;
          if (imgElement) {
            const imgSrcProperty = await imgElement.getProperty('src');
            imgSrc = await imgSrcProperty.jsonValue();
          } else {
            console.log('No image found');
          }

          const titleElement = await element.$('h6.css-16v5mdi');
          const title =
            (await titleElement?.evaluate((el) => el.textContent)) || '';

          const priceElement = await element.$('p[data-testid="ad-price"]');
          const price =
            (await priceElement?.evaluate((el) => el.textContent)) || '';

          const dateElement = await element.$('p[data-testid="location-date"]');
          const descriptionDate =
            (await dateElement?.evaluate((el) => el.textContent)) || '';

          const currentDate = new Date();

          // Convert the month number to a string representation
          const months = [
            'Ianuarie',
            'Febraurie',
            'Martie',
            'Aprilie',
            'Mai',
            'Iunie',
            'Iulie',
            'August',
            'Septembrie',
            'Octombrie',
            'Noiembrie',
            'Decembrie',
          ];
          const currentMonth = months[currentDate.getMonth()];
          const formattedDate = `${currentDate.getDate()} ${currentMonth} ${currentDate.getFullYear()}`;

          data[id] = {
            id,
            href,
            imgSrc,
            title,
            price,
            formattedDate,
            descriptionDate,
          };

          const scrapedListing = new Scraper();
          scrapedListing.id = id;
          scrapedListing.url = href;
          scrapedListing.image = imgSrc;
          scrapedListing.category = category;
          scrapedListing.description = descriptionDate;
          scrapedListing.location = descriptionDate.split('-')[0];
          scrapedListing.platform = 'olx';
          scrapedListing.price = parseFloat(price.replace('RON', ''));
          scrapedListing.name = title;

          this.scraperRepository.save(scrapedListing);
        }

        if (i > scrapePages) {
          break;
        }

        break;
      }

      // save each element in the data object to the database
      console.log(data);
      await browser.close();

      return {
        message: 'Scrape success',
        data,
      };
    } catch (error) {
      await browser.close();
      console.log(error);

      return {
        message: 'Scrape failed',
        data,
      };
    }
  }

  // scrapePubli24() {}

  // scrapeOkazii() {}

  // deleteOldListings() {}

  // runScrapes() {}
}
