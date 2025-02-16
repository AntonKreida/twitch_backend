import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { PasswordService } from './password.service';
import { PasswordRecoveryInputDto } from './dto';
import { ISessionMetadata, UserMetadata } from '@shared';

@Resolver()
export class PasswordResolver {
  constructor(private readonly passwordService: PasswordService) {}

  @Mutation(() => Boolean, { name: 'recoveryPassword' })
  async recoveryPassword(
    @Args('inputPasswordRecovery') { email }: PasswordRecoveryInputDto,
    @UserMetadata() metadata: ISessionMetadata,
  ): Promise<boolean> {
    return await this.passwordService.recoveryPassword(email, metadata);
  }
}
