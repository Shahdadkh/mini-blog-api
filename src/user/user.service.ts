import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { InjectRepository } from '@nestjs/typeorm';
import Users from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { UserInterface } from './interface/user.interface';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(Users)
    private readonly UsersRepository: Repository<Users>,
  ) {}

  async findOne(id: string) {
    const user = await this.UsersRepository.findOne({
      where: { uuid: id },
      relations: {
        posts: true,
      },
    });

    if (!user) {
      throw new HttpException('user not found.', HttpStatus.NOT_FOUND);
    }

    return user;
  }

  async update(
    userInfo: UserInterface,
    id: string,
    updateUserDto: UpdateUserDto,
  ) {
    //Find User
    const user = await this.UsersRepository.findOne({ where: { uuid: id } });

    if (!user) {
      throw new HttpException('user not found.', HttpStatus.NOT_FOUND);
    }

    //Checking User
    if (userInfo.role !== 'admin' && userInfo.sub !== user.uuid) {
      throw new HttpException('You are not allowed.', HttpStatus.FORBIDDEN);
    }

    //Handle Data
    const update = await this.UsersRepository.update(
      { uuid: id },
      { ...updateUserDto },
    );

    return {
      ...update,
      status: 'success',
      message: 'تغییرات با موفقیت لحاظ شد.',
    };
  }

  async changePassword(
    userInfo: UserInterface,
    id: string,
    UpdatePasswordDto: UpdatePasswordDto,
  ) {
    //Find User
    const user = await this.UsersRepository.findOne({ where: { uuid: id } });

    if (!user) {
      throw new HttpException('user not found.', HttpStatus.NOT_FOUND);
    }

    //Checking User
    if (userInfo.role !== 'admin' && userInfo.sub !== user.uuid) {
      throw new HttpException('You are not allowed.', HttpStatus.FORBIDDEN);
    }

    //Handle Data
    const isPasswordMatch = await bcrypt.compare(
      UpdatePasswordDto.oldPassword,
      user.password,
    );

    if (!isPasswordMatch) {
      throw new HttpException('Wrong password.', HttpStatus.NOT_FOUND);
    }

    user.password = await bcrypt.hash(UpdatePasswordDto.newPassword, 10);
    await this.UsersRepository.save(user);

    return {
      user: user.username,
      status: 'success',
      message: 'پسورد با موفقیت تغییر یافت.',
    };
  }
}
