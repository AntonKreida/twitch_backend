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
        if (error.extensions['code'] !== 'BAD_REQUEST') {
          return error;
        }

        console.log(error);

        const errorsParseJson = JSON.parse(error.message);

        return {
          message:
            error.extensions['originalError']?.['error'] ?? error.message,
          extensions: errorsParseJson,
          status: error.extensions['originalError']?.['status'] ?? 400,
        };
      },
    };
  }
}
