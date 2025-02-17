import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { PasswordService } from './password.service';
import { PasswordRecoveryInput } from './inputs';
import { ISessionMetadata, UserMetadata } from '@shared';

@Resolver()
export class PasswordResolver {
  constructor(private readonly passwordService: PasswordService) {}

  @Mutation(() => Boolean, { name: 'recoveryPassword' })
  async recoveryPassword(
    @Args('inputPasswordRecovery') { email }: PasswordRecoveryInput,
    @UserMetadata() metadata: ISessionMetadata,
  ): Promise<boolean> {
    return await this.passwordService.recoveryPassword(email, metadata);
  }
}
