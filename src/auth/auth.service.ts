import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from './dto/login-user.dto';
import * as bcrypt from 'bcrypt';
@Injectable()
export class AuthService {

  constructor(
    @InjectRepository( User )
    private readonly userRepository: Repository<User>,
    private jwtService: JwtService
  ){}

  async create(createUserDto: CreateUserDto) {
    try {
      const newUser = this.userRepository.create(createUserDto);
      await this.userRepository.save( newUser );
      return {
        message: "User created successfully"
      }
    } catch (error) {
      this.handleExceptions( error );
    }
  }

  async login( loginUserDto: LoginUserDto  ) {
    

    return {
      /* access_token: this.jwtService.sign({
        email,
        sub: user.id
      }) */
    }
  }

  public async validateUser( loginUserDto: LoginUserDto) {
    const user = await this.userRepository.findOneBy( { email: loginUserDto.email } );
    
    if ( !user || !await bcrypt.compare(loginUserDto.password, user.password)) {
      const { password, ...result } = user;
      return result;
    }

    return false;
      
  }

  private handleExceptions( error: any ) {

    if ( error.code === '23505' )
      throw new BadRequestException(error.detail);

    throw new InternalServerErrorException('Unexpected error, check server logs');

  }
}
