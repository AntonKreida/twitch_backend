import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { TfaService } from './tfa.service';
import { Auth, Authorized, ISessionMetadata, UserMetadata } from '/src/shared';
import { SendInitTwoFactorAuthenticationInput } from './inputs';

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
}
