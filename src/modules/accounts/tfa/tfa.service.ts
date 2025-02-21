import { Injectable, NotFoundException } from '@nestjs/common';
import { ENUM_TYPE_TOKEN } from '/prisma/generated';
import { UserRepository } from '@/modules/accounts/user/repositories';
import { VerificationService } from '@/modules/accounts/verification';
import { ISessionMetadata } from '@shared';

@Injectable()
export class TfaService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly verificationService: VerificationService,
  ) {}

  async sendInitTwoFactorAuthentication(
    userId: string,
    metadata: ISessionMetadata,
  ): Promise<boolean> {
    const user = await this.userRepository.findUser({ id: userId });

    if (!user) {
      throw new NotFoundException('Пользователь не найден!');
    }

    return await this.verificationService.sendVerificationTokenTwoFactorAuth(
      user.id,
      ENUM_TYPE_TOKEN.TFA,
      metadata,
    );
  }
}
