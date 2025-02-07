import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '/prisma/generated';
import { GqlExecutionContext } from '@nestjs/graphql';
import { IContext } from '../lib';
import { Request } from 'express';

export const Authorized = createParamDecorator<
  keyof User | undefined,
  ExecutionContext,
  User | string | Date
>((data, ctx) => {
  if (ctx.getType() === 'http') {
    const req = ctx.switchToHttp().getRequest<Request>();

    return data ? req.user[data] : req.user;
  }

  const ctxGql = GqlExecutionContext.create(ctx);
  const { req } = ctxGql.getContext<IContext>();

  return data ? req.user[data] : req.user;
});
