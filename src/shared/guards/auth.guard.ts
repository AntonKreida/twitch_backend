import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

import { UserRepository } from '@/modules/accounts/user/repositories';
import { IContext } from '../lib';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly userRepository: UserRepository) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const { req } = ctx.getContext<IContext>();

    if (!req.session.userId) {
      throw new UnauthorizedException('Пользователь не авторизован!');
    }

    const user = await this.userRepository.findUser({
      id: req.session.userId,
    });

    if (!user) {
      throw new UnauthorizedException('Пользователь не авторизован!');
    }

    req.user = user;

    return true;
  }
}
