import { Test, TestingModule } from '@nestjs/testing';
import { BrandItemsController } from './brand-items.controller';
import { BrandItemsService } from './brand-items.service';

describe('BrandItemsController', () => {
  let controller: BrandItemsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BrandItemsController],
      providers: [BrandItemsService],
    }).compile();

    controller = module.get<BrandItemsController>(BrandItemsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
