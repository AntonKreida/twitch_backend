import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { PasswordService } from './password.service';
import { PasswordConfirmInput, PasswordRecoveryInput } from './inputs';
import { Auth, Authorized, ISessionMetadata, UserMetadata } from '@shared';

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

  @Auth()
  @Mutation(() => Boolean, { name: 'confirmPassword' })
  async confirmPassword(
    @Args('confirmPasswordInput') { password }: PasswordConfirmInput,
    @Authorized('id') id: string,
  ) {
    return await this.passwordService.confirmPassword(id, password);
  }
}
