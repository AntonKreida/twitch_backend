import { FieldMiddleware, MiddlewareContext, NextFn } from '@nestjs/graphql';

export const pathFileMiddleware: FieldMiddleware = async (
  _ctx: MiddlewareContext,
  next: NextFn,
) => {
  const filePath: string = await next();
  return `${process.env.API_URL}/${filePath}`;
};
