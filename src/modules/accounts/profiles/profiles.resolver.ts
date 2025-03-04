import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { ProfilesService } from './profiles.service';
import { UserModel } from '@/modules/accounts/user';
import { Auth, Authorized } from '@shared';
import {
  ChangeAvatarUserInput,
  ChangeEmailUserInput,
  ChangeProfileInfoInput,
} from './inputs';

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

  @Auth()
  @Mutation(() => Boolean)
  async changeUserAvatar(
    @Authorized('id') id: string,
    @Args('changeUserAvatar') { avatar }: ChangeAvatarUserInput,
  ): Promise<boolean> {
    return await this.profilesService.changeUserAvatar(id, avatar);
  }

  @Auth()
  @Mutation(() => Boolean)
  async changeUserProfileInfo(
    @Authorized('id') id: string,
    @Args('updateUser') updateUser: ChangeProfileInfoInput,
  ): Promise<boolean> {
    return await this.profilesService.changeUserProfileInfo(id, updateUser);
  }
}
