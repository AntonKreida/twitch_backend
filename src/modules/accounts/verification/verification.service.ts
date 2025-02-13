import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Request } from 'express';
import { ENUM_TYPE_TOKEN, Token, User } from '/prisma/generated';

import { UserModel, UserRepository } from '../user';
import { SessionService } from '../session';

import { TokenRepository } from './repositories';
import { EntityToken } from './entities';

import { ISessionMetadata } from '@shared';

@Injectable()
export class VerificationService {
  constructor(
    private readonly tokenRepository: TokenRepository,
    private readonly userRepository: UserRepository,
    private readonly sessionService: SessionService,
  ) {}

  async sendVerificationToken(
    userId: string,
    typeToken: ENUM_TYPE_TOKEN,
  ): Promise<Token & { user: User }> {
    const oldToken = await this.tokenRepository.findTokenByUserIdAndType(
      userId,
      typeToken,
    );

    if (oldToken) {
      await this.tokenRepository.deleteTokenById(oldToken.id);
    }

    const newToken = new EntityToken({
      type: typeToken,
      userId,
    }).sendToken({ isUUID: true });

    const tokenCreated = await this.tokenRepository.createTokenUserById(
      userId,
      newToken,
    );

    return tokenCreated;
  }

  async verify(
    req: Request,
    token: string,
    metadata: ISessionMetadata,
  ): Promise<UserModel> {
    const tokenFound = await this.tokenRepository.findToken({
      tokenCode: token,
      tokenType: ENUM_TYPE_TOKEN.EMAIL,
    });

    if (!tokenFound) {
      new NotFoundException('Токен не найден!');
    }

    const hasExistedToken = new Date(tokenFound.expiresIn) < new Date();

    if (!hasExistedToken) {
      new BadRequestException('Токен устарел!');
    }

    const user = await this.userRepository.updateUser({
      id: tokenFound.userId,
      isEmailVerification: true,
    });

    await this.tokenRepository.deleteTokenById(tokenFound.id);

    return await this.sessionService.saveSession(req, user, metadata);
  }
}
