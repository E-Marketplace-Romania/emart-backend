import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { User } from '../user/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}
  async login(user: User, password: string) {
    if (!user) {
      throw new BadRequestException('Invalid credentials');
    }
    const salt = user.salt;
    const userPassword = user.password;
    const attemptPassword = await bcrypt.hash(password, salt);
    const isPasswordCorrect: boolean = attemptPassword === userPassword;

    if (!isPasswordCorrect) {
      throw new BadRequestException('Invalid credentials');
    } else {
      return this.getToken(user);
    }
  }

  private async getToken(user: User) {
    const payload = {
      email: user.email,
      role: user.role,
      sub: user.id,
    };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
