import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    private authService: AuthService,
    ) {
    super();
  }

  async validate(loginUserDto: LoginUserDto): Promise<any> {
        const user = await this.authService.validateUser(loginUserDto);
        if (!user) {
            throw new UnauthorizedException("User not found!");
        }

        return user;
    }
}