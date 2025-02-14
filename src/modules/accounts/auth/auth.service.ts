import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { type Response, type Request } from 'express';

import { UserRepository, UserEntity, UserModel } from '../user';
import { UserInputSignUpDto } from './dto';
import { ISessionMetadata } from '@shared';
import { VerificationService } from '../verification/verification.service';
import { ENUM_TYPE_TOKEN } from '/prisma/generated';
import { SessionService } from '../session';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly configService: ConfigService,
    private readonly verificationService: VerificationService,
    private readonly sessionService: SessionService,
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

    await this.verificationService.sendVerificationToken(
      newUser.id,
      ENUM_TYPE_TOKEN.EMAIL,
    );

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
