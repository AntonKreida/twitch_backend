import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ENUM_TYPE_TOKEN } from '/prisma/generated';
import { UserRepository } from '@/modules/accounts/user/repositories';
import { VerificationService } from '@/modules/accounts/verification';
import { UserEntity } from '@/modules/accounts/user/entities';

import { QrCodeModel } from './models';
import { ISessionMetadata } from '@shared';

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

  async sendGenerateQrCode(
    userId: string,
    token: string,
  ): Promise<QrCodeModel> {
    const isSuccess = await this.verificationService.verifyTwoFactorAuth(token);

    if (!isSuccess) {
      throw new UnauthorizedException('Неверный токен!');
    }

    const user = new UserEntity(
      await this.userRepository.findUser({ id: userId }),
    );

    if (!user) {
      throw new NotFoundException('Пользователь не найден!');
    }

    const updateUser = await user.generateSecretKey();

    await this.userRepository.updateUser({
      id: updateUser.id,
      twoFactorSecret: updateUser.twoFactorSecret,
    });

    return await updateUser.generateQrCode();
  }

  async enableTwoFactorAuth(userId: string, pincode: string): Promise<boolean> {
    const user = new UserEntity(
      await this.userRepository.findUser({ id: userId }),
    );

    if (!user) {
      throw new NotFoundException('Пользователь не найден!');
    }

    const isValid = await user.validatePincode(pincode);

    if (!isValid) {
      throw new UnauthorizedException('Неверный код!');
    }

    const updateUser = await user.enableTwoFactorAuth();

    await this.userRepository.updateUser({
      id: updateUser.id,
      isTwoFactorEnable: updateUser.isTwoFactorEnable,
    });

    return true;
  }

  async disableTwoFactorAuth(
    userId: string,
    password: string,
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

    const updateUser = await user.disableTwoFactorAuth();

    await this.userRepository.updateUser({
      id: updateUser.id,
      isTwoFactorEnable: updateUser.isTwoFactorEnable,
      twoFactorSecret: updateUser.twoFactorSecret,
    });

    return true;
  }
}
