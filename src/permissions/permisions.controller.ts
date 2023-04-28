import { Controller } from '@nestjs/common';
import { PermisionsService } from './permisions.service';

@Controller('permisions')
export class PermisionsController {
  constructor(private readonly permisionsService: PermisionsService) {}
}
