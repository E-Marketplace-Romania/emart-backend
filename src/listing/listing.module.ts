import { Module } from '@nestjs/common';
import { ListingService } from './listing.service';
import { ListingController } from './listing.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Listing } from './entities/listing.entity';
import { UserModule } from 'src/user/user.module';
import { CategoryModule } from 'src/category/category.module';
import { SubcategoryModule } from 'src/subcategory/subcategory.module';
import { TypeModule } from 'src/type/type.module';
import { BrandModule } from 'src/brand/brand.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Listing]),
    UserModule,
    CategoryModule,
    SubcategoryModule,
    TypeModule,
    BrandModule,
  ],
  controllers: [ListingController],
  providers: [ListingService],
})
export class ListingModule {}
