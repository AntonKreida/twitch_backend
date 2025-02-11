import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { MailerModule } from '@nestjs-modules/mailer';

import { PrismaModule } from './prisma';
import { GraphQLConfigService } from './graphql';
import { RedisModule } from './redis';
import { MailerConfigService } from './mailer';

import { UserModule, AuthModule, SessionModule, EmailModule } from '@modules';

import { isDevEnv } from '@shared';

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
    EmailModule,
  ],
})
export class CoreModule {}
