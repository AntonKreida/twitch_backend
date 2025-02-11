import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { MailerModule } from '@nestjs-modules/mailer';

import { PrismaModule } from './prisma';
import { GraphQLConfigService } from './graphql';
import { RedisModule } from './redis';

import { UserModule, AuthModule, SessionModule } from '@modules';

import { isDevEnv } from '@shared';
import { MailerConfigService } from './mailer/mailer.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      ignoreEnvFile: isDevEnv,
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
  ],
})
export class CoreModule {}
