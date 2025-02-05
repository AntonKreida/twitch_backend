import { ApolloDriverConfig } from '@nestjs/apollo';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { GqlOptionsFactory } from '@nestjs/graphql';
import { isDev } from '@shared';
import { GraphQLFormattedErrorExtensions } from 'graphql';

import { join } from 'path';

@Injectable()
export class GraphQLConfigService implements GqlOptionsFactory {
  constructor(private readonly configService: ConfigService) {}
  createGqlOptions(): ApolloDriverConfig {
    return {
      playground: isDev(this.configService),
      path: this.configService.getOrThrow<string>('GRAPHQL_PATH'),
      autoSchemaFile: join(process.cwd(), 'src/core/graphql/schema.gql'),
      sortSchema: true,
      context: ({ req, res }) => ({ req, res }),
      formatError: (error) => {
        const originalError = (
          error.extensions as GraphQLFormattedErrorExtensions
        )?.originalError;

        const isObjectAndHasMessage =
          !!originalError &&
          typeof originalError === 'object' &&
          'message' in originalError;

        const responseError = {
          message: isObjectAndHasMessage
            ? (originalError.message as string)
            : (error.message as string),
          code: error.extensions?.code as string,
        };

        return responseError;
      },
    };
  }
}
