import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { ProfilesService } from './profiles.service';
import { UserModel } from '@/modules/accounts/user';
import { Auth, Authorized } from '@shared';
import { ChangeEmailUserInput } from './inputs';

@Resolver()
export class ProfilesResolver {
  constructor(private readonly profilesService: ProfilesService) {}

  @Auth()
  @Mutation(() => UserModel)
  async changeEmail(
    @Authorized('id') id: string,
    @Args('changeEmailInput') { email }: ChangeEmailUserInput,
  ): Promise<UserModel> {
    return await this.profilesService.changeEmail(id, email);
  }
}
