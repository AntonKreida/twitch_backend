import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { MailerModule } from '@nestjs-modules/mailer';
import { join } from 'path';

import { PrismaModule } from './prisma';
import { GraphQLConfigService } from './graphql';
import { RedisModule } from './redis';
import { MailerConfigService } from './mailer';

import {
  UserModule,
  AuthModule,
  SessionModule,
  EmailModule,
  PasswordModule,
  TfaModule,
  DeactivatedModule,
  CroneModule,
  ProfilesModule,
  StreamModule,
} from '@modules';

import { isDevEnv } from '@shared';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      ignoreEnvFile: isDevEnv,
    }),
    ServeStaticModule.forRootAsync({
      useFactory: () => [
        {
          rootPath: join(__dirname, '..', 'public'),
          serveRoot: '/static',
          serveStaticOptions: {
            extensions: ['jpg', 'jpeg', 'png', 'gif'],
            index: false,
          },
        },
        {
          rootPath: join(__dirname, '..', 'uploads'),
          serveRoot: '/uploads',
          serveStaticOptions: {
            extensions: ['jpg', 'jpeg', 'png', 'gif'],
            index: false,
          },
        },
      ],
    }),
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      useClass: GraphQLConfigService,
      imports: [ConfigModule],
    }),
    MailerModule.forRootAsync({
      useClass: MailerConfigService,
      imports: [ConfigModule],
    }),
    PrismaModule,
    RedisModule,
    UserModule,
    AuthModule,
    SessionModule,
    PasswordModule,
    EmailModule,
    TfaModule,
    DeactivatedModule,
    CroneModule,
    ProfilesModule,
    StreamModule,
  ],
})
export class CoreModule {}
