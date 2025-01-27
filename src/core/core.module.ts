import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { PrismaModule } from './prisma';
import { GraphQLConfigService } from './graphql';
import { RedisModule } from './redis';
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
      inject: [ConfigService],
    }),
    PrismaModule,
    RedisModule,
  ],
})
export class CoreModule {}
