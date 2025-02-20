import { ApolloDriverConfig } from '@nestjs/apollo';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { GqlOptionsFactory } from '@nestjs/graphql';
import { Request, Response } from 'express';
import { isDev } from '@shared';

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
      context: ({ req, res }: { req: Request; res: Response }) => ({
        req,
        res,
      }),
      formatError: (error) => {
        let errorExtensions: null | Record<string, string>;

        try {
          errorExtensions = JSON.parse(error.message);
        } catch {
          errorExtensions = null;
        }

        const originalError = error.extensions?.originalError as Error | null;
        const errorMessage = originalError?.message ?? error.message;

        return {
          message: errorMessage,
          extensions: errorExtensions,
          status: error.extensions['originalError']?.['status'] ?? 400,
        };
      },
    };
  }
}
