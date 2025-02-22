import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { ENUM_TYPE_TOKEN, User, Token } from '/prisma/generated';

import { EmailService } from '@/modules/notification';
import { UserEntity, UserModel, UserRepository } from '@/modules/accounts/user';
import { SessionService } from '@/modules/accounts/session';

import { TokenRepository } from './repositories';
import { EntityToken } from './entities';

import { ISessionMetadata } from '@shared';
import { IGenerateToken } from './lib';

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
    metadata?: ISessionMetadata,
  ): Promise<boolean> {
    const tokenCreated = await this.generateToken({
      userId,
      typeToken,
    });

    const hostnameClient = await this.configService.getOrThrow<string>(
      'ALLOWED_ORIGIN',
    );

    const urlForLink = new URL(hostnameClient);
    urlForLink.searchParams.append('token', tokenCreated.token);

    return await this.emailService.sendEmail({
      emailFrom: 'Kx5wO@example.com',
      emailTo: tokenCreated.user.email,
      subject: 'Подтверждение аккаунта на TvStream',
      link: urlForLink.href,
      textLink: 'Подтвердить аккаунт',
      title: 'Подтверждение аккаунта на TvStream',
      subtitle: `Привет ${tokenCreated.user.firstName} ${tokenCreated.user.lastName}, `,
      message: `Спасибо что присоединились к нам! Мы рады видеть вас на нашей
                платформе! Сейчас для того чтобы начать пользоваться нашими
                возможностями, пожалуйста, нажмите на кнопку ниже.`,
      metadata,
    });
  }

  async verify(
    req: Request,
    token: string,
    metadata: ISessionMetadata,
  ): Promise<UserModel> {
    const tokenFound = await this.checkToken(token, ENUM_TYPE_TOKEN.EMAIL);

    const user = await this.userRepository.updateUser({
      id: tokenFound.userId,
      isEmailVerification: true,
    });

    await this.tokenRepository.deleteTokenById(tokenFound.id);

    return await this.sessionService.saveSession(req, user, metadata);
  }

  async sendVerificationPasswordRecovery(
    userId: string,
    typeToken: ENUM_TYPE_TOKEN,
    metadata: ISessionMetadata,
  ): Promise<boolean> {
    const tokenCreated = await this.generateToken({
      userId,
      typeToken,
    });

    const hostnameClient = await this.configService.getOrThrow<string>(
      'ALLOWED_ORIGIN',
    );

    const urlForLink = new URL(hostnameClient);
    urlForLink.pathname = '/recovery-password';
    urlForLink.searchParams.append('token', tokenCreated.token);

    return await this.emailService.sendEmail({
      emailFrom: 'Kx5wO@example.com',
      emailTo: tokenCreated.user.email,
      subject: 'Подтверждение восстановление пароля на TvStream',
      link: urlForLink.href,
      textLink: 'Подтвердите восстановление пароля',
      title: 'Подтверждение восстановление пароля на TvStream',
      subtitle: `Привет ${tokenCreated.user.firstName} ${tokenCreated.user.lastName}, `,
      message: `Для того чтобы восстановить пароль, пожалуйста, нажмите на кнопку ниже.`,
      metadata,
    });
  }

  async verifyPasswordRecovery(
    token: string,
    newPassword: string,
  ): Promise<boolean> {
    const tokenFound = await this.checkToken(token, ENUM_TYPE_TOKEN.PASSWORD);

    const user = new UserEntity(
      await this.userRepository.findUser({ id: tokenFound.userId }),
    );

    if (!user) {
      throw new NotFoundException('Пользователь не найден!');
    }

    const newPasswordHash = (await user.setPassword(newPassword)).passwordHash;

    await this.userRepository.updateUser({
      id: user.id,
      passwordHash: newPasswordHash,
    });

    await this.tokenRepository.deleteTokenById(tokenFound.id);

    return true;
  }

  async sendVerificationTokenTwoFactorAuth(
    userId: string,
    typeToken: ENUM_TYPE_TOKEN,
    metadata: ISessionMetadata,
  ): Promise<boolean> {
    const tokenCreated = await this.generateToken({
      userId,
      typeToken,
      isUUID: false,
    });

    return await this.emailService.sendEmail({
      emailFrom: 'Kx5wO@example.com',
      emailTo: tokenCreated.user.email,
      subject:
        'Подтверждение запроса на включение двойной аутентификации на TvStream',
      code: tokenCreated.token,
      title:
        'Подтверждение запроса на включение двойной аутентификации на TvStream',
      subtitle: `Привет ${tokenCreated.user.firstName} ${tokenCreated.user.lastName}, `,
      message: `Для того чтобы включить двойную аутентификацию, пожалуйста, введите код ниже:`,
      metadata,
    });
  }

  async verifyTwoFactorAuth(token: string): Promise<boolean> {
    const findToken = await this.checkToken(token, ENUM_TYPE_TOKEN.TFA);

    if (!findToken) {
      throw new NotFoundException('Токен не найден!');
    }

    await this.tokenRepository.deleteTokenById(findToken.id);

    return true;
  }

  private async generateToken({
    userId,
    typeToken,
    isUUID = true,
  }: IGenerateToken): Promise<Token & { user: User }> {
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
    }).sendToken({ isUUID: isUUID });

    return await this.tokenRepository.createTokenUserById(userId, newToken);
  }

  private async checkToken(
    token: string,
    tokenType: ENUM_TYPE_TOKEN,
  ): Promise<Token> {
    const tokenFound = await this.tokenRepository.findToken({
      tokenCode: token,
      tokenType,
    });

    if (!tokenFound) {
      new NotFoundException('Токен не найден!');
    }

    const hasExistedToken = new Date(tokenFound.expiresIn) < new Date();

    if (!hasExistedToken) {
      new BadRequestException('Токен устарел!');
    }

    return tokenFound;
  }
}
