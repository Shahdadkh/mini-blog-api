import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as passport from 'passport';
import * as session from 'express-session';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const config = new ConfigService();
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('/api');
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.use(
    session({
      secret: config.get('JWT_SECRET'),
    }),
  );
  app.use(passport.initialize());
  app.use(passport.session());
  app.enableCors();
  await app.listen(8000);
}
bootstrap();
