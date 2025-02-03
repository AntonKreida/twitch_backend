import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { PrismaModule } from './prisma';
import { GraphQLConfigService } from './graphql';
import { RedisModule } from './redis';
import { isDevEnv } from '@shared';
import { UserModule, AuthModule } from '@modules';

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
    PrismaModule,
    RedisModule,
    UserModule,
    AuthModule,
  ],
})
export class CoreModule {}
