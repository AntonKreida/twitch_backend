import { Injectable, NotFoundException } from '@nestjs/common';
import { ENUM_TYPE_TOKEN } from '/prisma/generated';

import { VerificationService } from '@/modules/accounts/verification';
import { UserEntity, UserRepository } from '@/modules/accounts/user';

import { ISessionMetadata } from '@shared';

@Injectable()
export class PasswordService {
  constructor(
    private readonly verificationService: VerificationService,
    private readonly userRepository: UserRepository,
  ) {}

  async recoveryPassword(
    userEmail: string,
    metadata: ISessionMetadata,
  ): Promise<boolean> {
    const user = await this.userRepository.findUser({ email: userEmail });

    if (!user) {
      throw new NotFoundException('Пользователь не найден!');
    }

    return this.verificationService.sendVerificationPasswordRecovery(
      user.id,
      ENUM_TYPE_TOKEN.PASSWORD,
      metadata,
    );
  }

  async confirmPassword(userId: string, password: string): Promise<boolean> {
    const user = new UserEntity(
      await this.userRepository.findUser({ id: userId }),
    );

    if (!user) {
      throw new NotFoundException('Пользователь не найден!');
    }

    const isCorrectPassword = await user.validatePassword(password);

    if (!isCorrectPassword) {
      throw new NotFoundException('Неверный пароль!');
    }

    return true;
  }

  async changePassword(
    userId: string,
    oldPassword: string,
    newPassword: string,
  ): Promise<boolean> {
    const user = new UserEntity(
      await this.userRepository.findUser({ id: userId }),
    );

    if (!user) {
      throw new NotFoundException('Пользователь не найден!');
    }

    const isCorrectOldPassword = await user.validatePassword(oldPassword);

    if (!isCorrectOldPassword) {
      throw new NotFoundException('Неверный пароль!');
    }

    const updatedUser = await user.setPassword(newPassword);

    await this.userRepository.updateUser({
      id: updatedUser.id,
      passwordHash: updatedUser.passwordHash,
    });

    return true;
  }
}
