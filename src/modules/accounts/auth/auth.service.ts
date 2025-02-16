import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ENUM_TYPE_TOKEN } from '/prisma/generated';
import { type Response, type Request } from 'express';

import { UserRepository, UserEntity, UserModel } from '../user';
import { SessionService } from '../session';
import { VerificationService } from '../verification';
import { EmailService } from '@/modules/notification';

import { UserInputSignUpDto } from './dto';
import { ISessionMetadata } from '@shared';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly verificationService: VerificationService,
    private readonly sessionService: SessionService,
    private readonly emailService: EmailService,
    private readonly configService: ConfigService,
  ) {}

  async signUp({
    avatar,
    bio,
    email,
    firstName,
    lastName,
    password,
    username,
  }: UserInputSignUpDto): Promise<boolean> {
    const userByUsername = await this.userRepository.findUser({
      username,
    });

    if (userByUsername) {
      throw new ConflictException(
        'Пользователь с таким username уже существует!',
      );
    }

    const userByEmail = await this.userRepository.findUser({
      email,
    });

    if (userByEmail) {
      throw new ConflictException('Пользователь с таким email уже существует!');
    }

    const newEntityUser = await new UserEntity({
      avatar,
      bio,
      email,
      firstName,
      lastName,
      username,
      passwordHash: '',
    }).setPassword(password);

    const newUser = await this.userRepository.createUser(newEntityUser);

    const token = await this.verificationService.sendVerificationToken(
      newUser.id,
      ENUM_TYPE_TOKEN.EMAIL,
    );

    const hostnameClient = await this.configService.getOrThrow<string>(
      'ALLOWED_ORIGIN',
    );

    const urlForLink = new URL(hostnameClient);
    urlForLink.searchParams.append('token', token.token);

    await this.emailService.sendEmail({
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      emailFrom: 'kreida.anton@yandex.ru',
      emailTo: newUser.email,
      subject: 'Подтверждение аккаунта',
      link: urlForLink.href,
    });

    return true;
  }

  async signIn(
    req: Request,
    username: string,
    password: string,
    metadata: ISessionMetadata,
  ): Promise<UserModel> {
    const user = await this.userRepository.findUser({ username });

    if (!user) {
      throw new NotFoundException('Пользователь не найден!');
    }

    const userEntity = new UserEntity(user);
    const isCorrectPassword = await userEntity.validatePassword(password);

    if (!isCorrectPassword) {
      throw new UnauthorizedException('Неверный пароль!');
    }

    if (!userEntity.isEmailVerification) {
      await this.verificationService.sendVerificationToken(
        user.id,
        ENUM_TYPE_TOKEN.EMAIL,
      );

      throw new BadRequestException(
        'Пользователь не подтвержден! Пожалуйста проверьте почту для подтверждения!',
      );
    }

    return await this.sessionService.saveSession(req, user, metadata);
  }

  async signOut(req: Request, res: Response): Promise<boolean> {
    return await this.sessionService.destroySession(req, res);
  }
}
