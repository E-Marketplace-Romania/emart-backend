import { Injectable } from '@nestjs/common';
import { CreateListingDto } from './dto/create-listing.dto';
import { UpdateListingDto } from './dto/update-listing.dto';
import { Listing } from './entities/listing.entity';
import { Repository } from 'typeorm';
import { CategoryService } from 'src/category/category.service';
import { UserService } from 'src/user/user.service';
import { SubcategoryService } from 'src/subcategory/subcategory.service';
import { TypeService } from 'src/type/type.service';
import { BrandService } from 'src/brand/brand.service';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ListingService {
  constructor(
    @InjectRepository(Listing) private listingRepository: Repository<Listing>,
    private readonly categoryService: CategoryService,
    private readonly userService: UserService,
    private readonly subcategoryService: SubcategoryService,
    private readonly typeService: TypeService,
    private readonly brandService: BrandService,
  ) {}
  async create(createListingDto: CreateListingDto): Promise<Listing> {
    const listing = new Listing();
    listing.title = createListingDto.title;
    listing.description = createListingDto.description;
    listing.price = createListingDto.price;
    listing.location = createListingDto.location;
    listing.category = await this.categoryService.findOne(
      createListingDto.category,
    );
    listing.subcategory = await this.subcategoryService.findOne(
      createListingDto.subcategory,
    );
    listing.type = await this.typeService.findOne(createListingDto.type);
    listing.brand = await this.brandService.findOne(createListingDto.brand);
    listing.user = await this.userService.findOne(createListingDto.user);
    return await this.listingRepository.save(listing);
  }

  async findAll(): Promise<Listing[]> {
    return this.listingRepository.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} listing`;
  }

  findOneByTitle(title: string) {
    return this.listingRepository.findOneBy({
      title,
    });
  }

  findOneByExternalId(externalId: string) {
    return this.listingRepository.findOneBy({
      externalId,
    });
  }

  async findAllByCategory(category: string) {
    const categoryObject = await this.categoryService.findOne(category);
    return this.listingRepository.findBy({
      category: categoryObject,
    });
  }

  update(id: number, updateListingDto: UpdateListingDto) {
    return `This action updates a #${id} listing`;
  }

  remove(id: number) {
    return `This action removes a #${id} listing`;
  }
}
