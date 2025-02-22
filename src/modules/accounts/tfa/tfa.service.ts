import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ENUM_TYPE_TOKEN } from '/prisma/generated';
import { UserRepository } from '@/modules/accounts/user/repositories';
import { VerificationService } from '@/modules/accounts/verification';
import { ISessionMetadata } from '@shared';
import { UserEntity } from '../user';

@Injectable()
export class TfaService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly verificationService: VerificationService,
  ) {}

  async sendInitTwoFactorAuthentication(
    userId: string,
    password: string,
    metadata: ISessionMetadata,
  ): Promise<boolean> {
    const user = new UserEntity(
      await this.userRepository.findUser({ id: userId }),
    );

    if (!user) {
      throw new NotFoundException('Пользователь не найден!');
    }

    const isCorrectPassword = await user.validatePassword(password);

    if (!isCorrectPassword) {
      throw new UnauthorizedException('Неверный пароль!');
    }

    return await this.verificationService.sendVerificationTokenTwoFactorAuth(
      user.id,
      ENUM_TYPE_TOKEN.TFA,
      metadata,
    );
  }
}
