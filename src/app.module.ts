import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ListingModule } from './listing/listing.module';
import { RatingModule } from './rating/rating.module';
import { UserModule } from './user/user.module';
import { BrandItemsModule } from './brand-items/brand-items.module';
import { BrandModule } from './brand/brand.module';
import { TypeModule } from './type/type.module';
import { SubcategoryModule } from './subcategory/subcategory.module';
import { CategoryModule } from './category/category.module';
import { ListingModule } from './listing/listing.module';

@Module({
  imports: [ListingModule, CategoryModule, SubcategoryModule, TypeModule, BrandModule, BrandItemsModule, UserModule, RatingModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
