import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Scraper } from './entities/scraper.entity';
import { Repository } from 'typeorm';
import puppeteer, { Page } from 'puppeteer';
import { In } from 'typeorm';
import {
  manufacturers,
  memorySpecs,
  memoryTypes,
  models,
  otherSpecs,
  powerSupplySpecs,
  storageSpecs,
} from './make_models';
import {
  paginate,
  Pagination,
  IPaginationOptions,
} from 'nestjs-typeorm-paginate';

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

export type OlxCategory =
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

export type OkaziiCategory =
  | 'procesor'
  | 'placa-video'
  | 'placa-de-baza'
  | 'memorie-ram'
  | 'ssd'
  | 'coolere-ventilatoare'
  | 'hard-disk'
  | 'placa-video'
  | 'surse'
  | 'carcasa'
  | 'placa-de-sunet';

@Injectable()
export class ScraperService {
  constructor(
    @InjectRepository(Scraper) private scraperRepository: Repository<Scraper>,
  ) {}

  findAll(
    options: IPaginationOptions,
    categories: string[],
  ): Promise<Pagination<Scraper>> {
    if (categories && categories.length > 0) {
      return paginate<Scraper>(this.scraperRepository, options, {
        where: {
          category: In(categories),
        },
      });
    }

    return paginate<Scraper>(this.scraperRepository, options);
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

  async scrapeOlx(scrapePages = 0, category: OlxCategory) {
    const browser = await puppeteer.launch({
      headless: true,
    });

    const URL = `https://www.olx.ro/electronice-si-electrocasnice/componente-laptop-pc/${category}/?currency=RON`;
    Logger.log(`Scraping ${URL}`);
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
      Logger.log(`Number of pages to scrape: ${lastPage}`);
      for (let i = 1; i <= parseInt(lastPage); i++) {
        Logger.log(`${category} page ${i}`);
        if (i >= 2) {
          await page.goto(`${URL}&page=${i}`, { waitUntil: 'networkidle0' });
          await this.autoScroll(page);
        }

        const elements = await page.$$('div[data-cy="l-card"]');
        Logger.log(`Number of elements: ${elements.length}`);
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
            Logger.warn('No image found');
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
            price: price,
            formattedDate,
            descriptionDate,
          };

          const { extraSpecs, make, memory, model, power, sorageCappacity } =
            this.identifySpecs(title);

          const scrapedListing = new Scraper();
          scrapedListing.id = id;
          scrapedListing.url = href;
          scrapedListing.image = imgSrc;
          scrapedListing.category = category;
          scrapedListing.postedAt = formattedDate;
          scrapedListing.location = descriptionDate.split('-')[0];
          scrapedListing.platform = 'olx';
          scrapedListing.price = price;
          scrapedListing.name = title;
          scrapedListing.otherSpec = extraSpecs;
          scrapedListing.make = make;
          scrapedListing.model = model;
          scrapedListing.memory = memory;
          scrapedListing.powerSpec = power;
          scrapedListing.storage = sorageCappacity;

          this.scraperRepository.save(scrapedListing);
        }

        if (i > scrapePages && scrapePages !== 0) {
          break;
        }
      }

      await browser.close();

      return {
        message: 'Scrape success',
        data,
      };
    } catch (error) {
      await browser.close();
      Logger.error(error);

      return {
        message: 'Scrape failed',
        data,
      };
    }
  }

  async scrapeOkazii(scrapePages = 0, category: OkaziiCategory) {
    const URL = `https://www.okazii.ro/componente-computere/${category}--second-hand/`;

    try {
      const browser = await puppeteer.launch({
        headless: true,
      });
      const page = await browser.newPage();
      await page.goto(URL, { waitUntil: 'networkidle0' });
      await page.setViewport({ width: 1920, height: 1080 });

      const data = {};
      const pages = await page.$$('li .tracking-pager-page');

      const lastPage = await pages[pages.length - 1].evaluate(
        (el) => el.textContent,
      );
      Logger.log(`${category} number of pages`, lastPage);

      for (let i = 1; i <= parseInt(lastPage); i++) {
        Logger.log(`${category} page ${i}`);
        if (i >= 2) {
          await page.goto(`${URL}?page=${i}`, { waitUntil: 'networkidle0' });
        }

        const elements = await page.$$('div.lising-old-li');
        Logger.log(`${category} number of elements`, elements.length);

        for (const element of elements) {
          const titleDiv = await element.$('.item-title');
          const anchorElement = await titleDiv.$('a');
          const href = await anchorElement.evaluate((el) =>
            el.getAttribute('href'),
          );
          const trackingId = await anchorElement.evaluate((el) =>
            el.getAttribute('trackingid'),
          );
          const title = await anchorElement.evaluate((el) =>
            el.getAttribute('title'),
          );

          const priceParentDiv = await page.$('.pull-left.fixed-price');

          // Find the nested div element with class "main-cost"
          const mainCostDiv = await priceParentDiv.$('.main-cost');

          // Extract the item price
          const itemPrice = await mainCostDiv.evaluate((el) =>
            el.textContent.trim(),
          );

          const imgParentDiv = await page.$('.item-image-wrapper');

          // Find the nested img element
          const imgElement = await imgParentDiv.$('img');

          // Extract the src attribute
          const imgSrc = await imgElement.evaluate((el) =>
            el.getAttribute('src'),
          );

          data[trackingId] = {
            id: trackingId,
            href,
            imgSrc,
            title,
            price: itemPrice,
          };

          const { extraSpecs, make, memory, model, power, sorageCappacity } =
            this.identifySpecs(title);

          const scrapedListing = new Scraper();
          scrapedListing.id = trackingId + '-okazii';
          scrapedListing.url = href;
          scrapedListing.image = imgSrc;
          scrapedListing.category = category;
          scrapedListing.platform = 'okazii';
          scrapedListing.price = itemPrice;
          scrapedListing.name = title;
          scrapedListing.location = 'Romania';
          scrapedListing.description = '';
          scrapedListing.postedAt = '';
          scrapedListing.otherSpec = extraSpecs;
          scrapedListing.make = make;
          scrapedListing.model = model;
          scrapedListing.memory = memory;
          scrapedListing.powerSpec = power;
          scrapedListing.storage = sorageCappacity;
          this.scraperRepository.save(scrapedListing);
        }

        if (i > scrapePages && scrapePages !== 0) {
          break;
        }
      }

      return {
        message: 'Scrape success',
        data,
      };
    } catch (error) {
      Logger.error(error);
      return {
        message: 'Scrape fail',
        error,
      };
    }
  }

  async runScrapes() {
    const data = {};
    try {
      Logger.log('Running scrapes');

      Logger.log('OLX scrape');
      const olxCategories = [
        'placi-video',
        'placi-de-baza',
        'surse-pc',
        'placi-de-sunet',
        'coolere-si-ventilatoare-pc',
        'carcase-pc',
        'procesoare',
        'placi-de-baza',
        'memorii-ram',
        'hard-disk-uri',
      ];

      Logger.log(olxCategories);
      for (const category of olxCategories) {
        Logger.log(`Scraping ${category}`);
        data[`olx-${category}`] = await this.scrapeOlx(
          0,
          category as OlxCategory,
        );
      }

      Logger.log('Okazii scrape');
      const okaziiCategories = [
        'procesor',
        'placa-video',
        'placa-de-baza',
        'memorie-ram',
        'ssd',
        'coolere-ventilatoare',
        'hard-disk',
        'surse',
        'carcasa',
        'placa-de-sunet',
      ];
      Logger.log(okaziiCategories);
      for (const category of okaziiCategories) {
        Logger.log(`Scraping ${category}`);
        data[`okazii-${category}`] = await this.scrapeOkazii(
          0,
          category as OkaziiCategory,
        );
      }

      return {
        message: 'Scrape success',
        data,
      };
    } catch (error) {
      Logger.error(error);
      return {
        message: 'Scrape fail',
        error,
      };
    }
  }

  async correctSpecs() {
    try {
      const listings: Scraper[] = await this.scraperRepository.find();
      Logger.log(`Found ${listings.length} listings`);
      for (const listing of listings) {
        Logger.log(`Correcting ${listing.name}`);
        const { extraSpecs, make, memory, model, power, sorageCappacity } =
          this.identifySpecs(listing.name);

        listing.make = make;
        listing.model = model;
        listing.memory = memory;
        listing.powerSpec = power;
        listing.storage = sorageCappacity;
        listing.otherSpec = extraSpecs;
        Logger.log(listing);
        await this.scraperRepository.save(listing);
      }
      return {
        success: true,
      };
    } catch (error) {
      Logger.error(error);
      return {
        success: false,
        error,
      };
    }
  }

  async correctCategory(category: string) {
    try {
      const listings: Scraper[] = await this.scraperRepository.find({
        where: {
          category,
        },
      });

      for (const listing of listings) {
        Logger.log(`Correcting ${listing.name}`);
        const { name } = listing;
        const correctCategory = this.matchString(name, category);
        if (correctCategory) {
          listing.category = correctCategory;
          await this.scraperRepository.save(listing);
        } else {
          continue;
        }
      }
      Logger.log(`Found ${listings.length} listings`);
    } catch (error) {
      Logger.error(error);
    }
  }

  private matchString(title: string, word: string): string {
    const formattedInput = title.toLowerCase();
    const regex = new RegExp(`\\b${word}\\b`, 'i');
    const match = formattedInput.match(regex);
    return match ? match[0] : null;
  }

  private matchSpecs(title: string, specList: string[]): string {
    const formattedInput = title.toLowerCase();

    for (const model of specList) {
      const formattedModel = model.toLowerCase().replace(/\s/g, '');
      const regexPattern = formattedModel.split('').join('\\s*');
      const regex = new RegExp(regexPattern.replace(/\+/g, '\\+'), 'i');

      if (regex.test(formattedInput)) {
        return model;
      }
    }

    return 'Other';
  }

  private identifySpecs(title: string) {
    const result = {
      make: 'Other',
      model: 'Other',
      power: 'Other',
      memory: 'Other',
      sorageCappacity: 'Other',
      extraSpecs: 'Other',
      memoryType: 'Other',
    };

    result.make = this.matchSpecs(title, manufacturers);
    result.model = this.matchSpecs(title, models);
    result.memory = this.matchSpecs(title, memorySpecs);
    result.power = this.matchSpecs(title, powerSupplySpecs);
    result.sorageCappacity = this.matchSpecs(title, storageSpecs);
    result.extraSpecs = this.matchSpecs(title, otherSpecs);
    result.memoryType = this.matchSpecs(title, memoryTypes);

    return { ...result };
  }

  // scrape publi24() {}
  // scrape mercador() {}
  // scrape lajumate() {}
}
