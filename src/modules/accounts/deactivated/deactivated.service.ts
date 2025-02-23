import { Injectable, NotFoundException } from '@nestjs/common';
import { ENUM_TYPE_TOKEN } from '/prisma/generated';
import { Request, Response } from 'express';

import { VerificationService } from '@/modules/accounts/verification';
import { UserRepository } from '@/modules/accounts/user/repositories';
import { UserEntity } from '@/modules/accounts/user/entities';
import { UserModel } from '@/modules/accounts/user/models';

import { ISessionMetadata } from '@shared';

@Injectable()
export class DeactivatedService {
  constructor(
    private readonly verificationService: VerificationService,
    private readonly userRepository: UserRepository,
  ) {}

  async sendDeactivatedAccountEmail(
    userId: string,
    metadata: ISessionMetadata,
  ): Promise<boolean> {
    return await this.verificationService.sendDeactivatedAccount(
      userId,
      ENUM_TYPE_TOKEN.DEACTIVATED,
      metadata,
    );
  }

  async deactivated(
    token: string,
    req: Request,
    res: Response,
    userId: string,
    password: string,
    metadata: ISessionMetadata,
  ): Promise<UserModel> {
    const user = new UserEntity(
      await this.userRepository.findUser({ id: userId }),
    );

    const isCorrectPassword = await user.validatePassword(password);

    if (!isCorrectPassword) {
      throw new NotFoundException('Неверный пароль!');
    }

    if (!token) {
      await this.sendDeactivatedAccountEmail(userId, metadata);

      throw new NotFoundException('Требуется код подтверждения!');
    }

    return await this.verificationService.verifyDeactivatedAccount(
      token,
      req,
      res,
    );
  }
}
