import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { type Request } from 'express';
import { IContext, getMetadata } from '../lib';

export const UserMetadata = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    if (ctx.getType() === 'http') {
      const req = ctx.switchToHttp().getRequest() as Request;

      const userAgent = req.headers['user-agent'];

      return getMetadata(req, userAgent);
    }

    const context = GqlExecutionContext.create(ctx);
    const { req } = context.getContext<IContext>();

    const userAgent = req.headers['user-agent'];

    return getMetadata(req, userAgent);
  },
);
