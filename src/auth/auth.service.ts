import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { LoginAuthDto } from './dto/login.dto';
//import { RegisterAuthDto } from './dto/register.dto';
import { InjectRepository } from '@nestjs/typeorm';
import Users from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Users)
    private readonly UsersRepository: Repository<Users>,
    private readonly jwtService: JwtService,
  ) {}

  // async register(RegisterAuthDto: RegisterAuthDto) {
  //   const checkEmail = await this.UsersRepository.findOne({
  //     where: {
  //       username: RegisterAuthDto.username,
  //     },
  //   });

  //   if (checkEmail) {
  //     throw new HttpException('username already exist.', HttpStatus.FORBIDDEN);
  //   }

  //   RegisterAuthDto.password = await bcrypt.hash(RegisterAuthDto.password, 10);
  //   const user = this.UsersRepository.create(RegisterAuthDto);
  //   this.UsersRepository.save(user);

  //   const data = {
  //     user: user,
  //     status: 'success',
  //     message: 'کاربر با موفقیت ساخته شد.',
  //   };

  //   return data;
  // }

  async install() {
    const checkEmail = await this.UsersRepository.findOne({
      where: {
        username: 'admin',
      },
    });

    if (checkEmail) {
      throw new HttpException('username already exist.', HttpStatus.FORBIDDEN);
    }

    const user = new Users();
    user.username = 'admin';
    user.password = await bcrypt.hash('admin', 10);

    await this.UsersRepository.save(user);
    return {
      username: user.username,
      status: 'success',
      message: 'کاربر با موفقیت ساخته شد.',
    };
  }

  async login(LoginAuthDto: LoginAuthDto) {
    const user = await this.UsersRepository.findOne({
      where: {
        username: LoginAuthDto.username,
      },
    });

    if (!user) {
      throw new HttpException('User not Found', HttpStatus.NOT_FOUND);
    }

    const isPasswordMatch = await bcrypt.compare(
      LoginAuthDto.password,
      user.password,
    );

    if (!isPasswordMatch) {
      throw new HttpException('Wrong password.', HttpStatus.BAD_REQUEST);
    }

    const accessToken = this.jwtService.sign({
      sub: user.id,
      username: user.username,
    });

    return {
      id: user.id,
      username: user.username,
      access_token: accessToken,
    };
  }
}
