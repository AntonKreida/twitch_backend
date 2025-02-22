import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { TfaService } from './tfa.service';
import { Auth, Authorized, ISessionMetadata, UserMetadata } from '/src/shared';
import { SendInitTwoFactorAuthenticationInput } from './inputs';
import { QrCodeModel } from './models';
import { SendGeneratedQrCodeInput } from './inputs/send-generated-qr-code.input';

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
  ) {
    return await this.tfaService.sendGenerateQrCode(id, token);
  }
}
