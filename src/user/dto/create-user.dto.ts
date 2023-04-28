import { Role } from 'src/role/entities/role.entity';

export class CreateUserDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: string;
}
