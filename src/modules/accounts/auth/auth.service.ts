import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ENUM_TYPE_TOKEN } from '/prisma/generated';
import { type Response, type Request } from 'express';

import { UserRepository, UserEntity, UserModel } from '../user';
import { SessionService } from '../session';
import { VerificationService } from '../verification';

import { UserSignUpInput } from './inputs';
import { ISessionMetadata } from '@shared';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
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
  }: UserSignUpInput): Promise<boolean> {
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

    return await this.verificationService.sendVerificationToken(
      newUser.id,
      ENUM_TYPE_TOKEN.EMAIL,
    );
  }

  async signIn(
    req: Request,
    username: string,
    password: string,
    metadata: ISessionMetadata,
    pincode?: string,
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
        metadata,
      );

      throw new BadRequestException(
        'Пользователь не подтвержден! Пожалуйста проверьте почту для подтверждения!',
      );
    }

    if (userEntity.isTwoFactorEnable) {
      if (!pincode) {
        throw new BadRequestException('Неверный код!');
      }

      const isValid = await userEntity.validatePincode(pincode);

      if (!isValid) {
        throw new BadRequestException('Неверный код!');
      }
    }

    return await this.sessionService.saveSession(req, user, metadata);
  }

  async signOut(req: Request, res: Response): Promise<boolean> {
    return await this.sessionService.destroySession(req, res);
  }
}
