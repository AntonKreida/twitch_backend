import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { ENUM_TYPE_TOKEN } from '/prisma/generated';

import { EmailService } from '@/modules/notification';
import { UserModel, UserRepository } from '@/modules/accounts/user';
import { SessionService } from '@/modules/accounts/session';

import { TokenRepository } from './repositories';
import { EntityToken } from './entities';

import { ISessionMetadata } from '@shared';

@Injectable()
export class VerificationService {
  constructor(
    private readonly tokenRepository: TokenRepository,
    private readonly userRepository: UserRepository,
    private readonly sessionService: SessionService,
    private readonly emailService: EmailService,
    private readonly configService: ConfigService,
  ) {}

  async sendVerificationToken(
    userId: string,
    typeToken: ENUM_TYPE_TOKEN,
  ): Promise<boolean> {
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

    const hostnameClient = await this.configService.getOrThrow<string>(
      'ALLOWED_ORIGIN',
    );

    const urlForLink = new URL(hostnameClient);
    urlForLink.searchParams.append('token', tokenCreated.token);

    return await this.emailService.sendEmail({
      firstName: tokenCreated.user.firstName,
      lastName: tokenCreated.user.lastName,
      emailFrom: 'Kx5wO@example.com',
      emailTo: tokenCreated.user.email,
      subject: 'Подтверждение аккаунта на TvStream',
      link: urlForLink.href,
    });
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
