import { Injectable, NotFoundException } from '@nestjs/common';
import { ENUM_TYPE_TOKEN } from '/prisma/generated';

import { VerificationService } from '@/modules/accounts/verification';
import { UserRepository } from '@/modules/accounts/user';

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
}
