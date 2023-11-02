import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { PostsModule } from './post/post.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentModule } from './comment/comment.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoggerMiddleware } from './auth/middleware/logger.middleware';
import { AppService } from './app.service';
import Users from './user/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          type: 'postgres',

          /* Please Comment host,port,username,password,database if you want to use url. */
          host: configService.get(`PG_HOST`),
          port: configService.get(`PG_PORT`),
          username: configService.get('PG_USER'),
          password: configService.get('PG_PASS'),
          database: configService.get('PG_DB'),

          /* Please uncomment it if you want to use url */
          //url: configService.get('DATABASE_URL'),

          entities: [__dirname + '/**/*.entity{.ts,.js}'],
          synchronize: true,
        };
      },
    }),
    PostsModule,
    CommentModule,
    UserModule,
    AuthModule,
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forFeature([Users]),
  ],
  controllers: [],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
