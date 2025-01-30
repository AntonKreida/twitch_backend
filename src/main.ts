import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';
import * as session from 'express-session';
import { RedisStore } from 'connect-redis';

import { RedisService } from './core/redis/';
import { CoreModule } from './core';
import {
  getMillisecondsFromDay,
  isDevEnv,
  validationPipeConfig,
} from '@shared';

async function bootstrap() {
  const app = await NestFactory.create(CoreModule);

  const config = app.get(ConfigService);
  const redis = app.get(RedisService);

  app.use(cookieParser(config.getOrThrow<string>('COOKIE_SECRET')));

  app.useGlobalPipes(validationPipeConfig);

  app.use(
    session({
      secret: config.getOrThrow<string>('SESSION_SECRET'),
      saveUninitialized: false,
      resave: false,
      name: config.getOrThrow<string>('SESSION_NAME'),
      cookie: {
        domain: config.getOrThrow<string>('SESSION_DOMAIN'),
        maxAge: getMillisecondsFromDay(
          config.getOrThrow<number>('SESSION_MAX_DAYS'),
        ),
        secure: isDevEnv ? false : true,
        httpOnly: isDevEnv ? false : true,
        sameSite: 'lax',
      },
      store: new RedisStore({
        client: redis,
        prefix: config.getOrThrow<string>('SESSION_PREFIX'),
      }),
    }),
  );

  app.enableCors({
    origin: config.getOrThrow<string>('ALLOWED_ORIGIN'),
    credentials: true,
    exposedHeaders: ['set-cookie'],
  });

  await app.listen(config.getOrThrow<string>('API_PORT') || 3000);
}
bootstrap();
