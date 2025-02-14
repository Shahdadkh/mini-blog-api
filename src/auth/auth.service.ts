import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { LoginAuthDto } from './dto/login.dto';
import { RegisterAuthDto } from './dto/register.dto';
import { InjectRepository } from '@nestjs/typeorm';
import Users from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { v4 as uuidv4 } from 'uuid';
import { nanoid } from 'nanoid';
import { createAvatar } from '@dicebear/core';
import { identicon } from '@dicebear/collection';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Users)
    private readonly UsersRepository: Repository<Users>,
    private readonly jwtService: JwtService,
  ) {}

  async register(RegisterAuthDto: RegisterAuthDto) {
    const checkEmail = await this.UsersRepository.findOne({
      where: {
        username: RegisterAuthDto.username,
      },
    });

    if (checkEmail) {
      throw new HttpException('username already exist.', HttpStatus.FORBIDDEN);
    }

    const avatar = createAvatar(identicon, { seed: RegisterAuthDto.username });
    RegisterAuthDto.password = await bcrypt.hash(RegisterAuthDto.password, 10);
    const user = this.UsersRepository.create({
      ...RegisterAuthDto,
      uuid: uuidv4(),
      displayName: nanoid(8),
      imgUrl: avatar.toString(),
    });
    this.UsersRepository.save(user);

    const data = {
      uuid: user.uuid,
      username: user.username,
      status: 'success',
      message: 'User successfully created.',
    };

    return data;
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
      sub: user.uuid,
      username: user.username,
      role: user.role,
    });

    return {
      uuid: user.uuid,
      username: user.username,
      role: user.role,
      access_token: accessToken,
    };
  }
}
