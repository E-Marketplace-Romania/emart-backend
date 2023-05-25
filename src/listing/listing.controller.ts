import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ListingService } from './listing.service';
import { CreateListingDto } from './dto/create-listing.dto';
import { UpdateListingDto } from './dto/update-listing.dto';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';

@Controller('listing')
@UseGuards(RolesGuard)
export class ListingController {
  constructor(private readonly listingService: ListingService) {}

  @Post()
  @Roles(['ADMIN'])
  create(@Body() createListingDto: CreateListingDto) {
    return this.listingService.create(createListingDto);
  }

  @Get()
  findAll() {
    return this.listingService.findAll();
  }

  @Get(':id')
  @Roles(['ADMIN'])
  findOne(@Param('id') id: string) {
    return this.listingService.findOne(+id);
  }

  @Patch(':id')
  @Roles(['ADMIN'])
  update(@Param('id') id: string, @Body() updateListingDto: UpdateListingDto) {
    return this.listingService.update(+id, updateListingDto);
  }

  @Delete(':id')
  @Roles(['ADMIN'])
  remove(@Param('id') id: string) {
    return this.listingService.remove(+id);
  }
}
