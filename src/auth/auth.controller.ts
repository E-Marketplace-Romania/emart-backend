import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from 'src/user/user.service';
import { UserLoginDto } from './UserLoginDto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}
  @Post('login')
  async login(@Body() userLoginDto: UserLoginDto) {
    const { email, password } = userLoginDto;
    const user = await this.userService.findOne(email);
    console.log(user);
    return this.authService.login(user, password);
  }
}
