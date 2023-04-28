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
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { RoleModule } from './role/role.module';
import { PermisionsModule } from './permissions/permisions.module';
import { AuthModule } from './auth/auth.module';
import { RolesGuard } from './auth/roles.guard';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      database: 'emart',
      username: 'root',
      password: 'password',
      entities: ['dist/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    ListingModule,
    CategoryModule,
    SubcategoryModule,
    TypeModule,
    BrandModule,
    BrandItemsModule,
    RatingModule,
    UserModule,
    RoleModule,
    PermisionsModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private dataSource: DataSource) {
    console.log('AppModule');
  }
}
