import { Test, TestingModule } from '@nestjs/testing';
import { BrandItemsService } from './brand-items.service';

describe('BrandItemsService', () => {
  let service: BrandItemsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BrandItemsService],
    }).compile();

    service = module.get<BrandItemsService>(BrandItemsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
