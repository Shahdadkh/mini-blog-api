import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Users from './user/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService implements OnModuleInit {
  constructor(
    @InjectRepository(Users)
    private readonly UsersRepository: Repository<Users>,
    private config: ConfigService,
  ) {}

  async onModuleInit() {
    const username = this.config.get('ADMIN_USER');
    const password = this.config.get('ADMIN_PASS');

    const checkEmail = await this.UsersRepository.findOne({
      where: {
        username: username,
      },
    });

    if (!checkEmail) {
      const user = new Users();
      user.username = username;
      user.password = await bcrypt.hash(password, 10);
      user.role = 'admin';

      await this.UsersRepository.save(user);
      return {
        username: user.username,
        status: 'success',
        message: 'کاربر با موفقیت ساخته شد.',
      };
    }
  }
}
