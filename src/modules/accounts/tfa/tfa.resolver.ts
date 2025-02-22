import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { TfaService } from './tfa.service';
import {
  DisableTwoFactorAuthInput,
  EnableTwoFactorAuthInput,
  SendInitTwoFactorAuthenticationInput,
  SendGeneratedQrCodeInput,
} from './inputs';
import { QrCodeModel } from './models';

import { Auth, Authorized, ISessionMetadata, UserMetadata } from '@shared';

@Resolver()
export class TfaResolver {
  constructor(private readonly tfaService: TfaService) {}

  @Auth()
  @Mutation(() => Boolean, { name: 'sendInitTwoFactorAuthentication' })
  async sendInitTwoFactorAuthentication(
    @Authorized('id') id: string,
    @Args('inputInitTwoFactorAuthentication')
    { password }: SendInitTwoFactorAuthenticationInput,
    @UserMetadata() metadata: ISessionMetadata,
  ) {
    return await this.tfaService.sendInitTwoFactorAuthentication(
      id,
      password,
      metadata,
    );
  }

  @Auth()
  @Mutation(() => QrCodeModel, { name: 'sendGenerateQrCode' })
  async sendGenerateQrCode(
    @Authorized('id') id: string,
    @Args('SendGeneratedQrCodeInput') { token }: SendGeneratedQrCodeInput,
  ): Promise<QrCodeModel> {
    return await this.tfaService.sendGenerateQrCode(id, token);
  }

  @Auth()
  @Mutation(() => Boolean, { name: 'enableTwoFactorAuth' })
  async enableTwoFactorAuth(
    @Authorized('id') id: string,
    @Args('enubleTwoFactorAuthInput')
    { pincode }: EnableTwoFactorAuthInput,
  ): Promise<boolean> {
    return await this.tfaService.enableTwoFactorAuth(id, pincode);
  }

  @Auth()
  @Mutation(() => Boolean, { name: 'disableTwoFactorAuth' })
  async disableTwoFactorAuth(
    @Authorized('id') id: string,
    @Args('disableTwoFactorAuthInput') { password }: DisableTwoFactorAuthInput,
  ): Promise<boolean> {
    return await this.tfaService.disableTwoFactorAuth(id, password);
  }
}
