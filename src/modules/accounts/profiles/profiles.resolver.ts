import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { ProfilesService } from './profiles.service';
import { UserModel } from '@/modules/accounts/user';
import { Auth, Authorized } from '@shared';
import {
  ChangeAvatarUserInput,
  ChangeEmailUserInput,
  ChangeProfileInfoInput,
  ChangeReorderSocialInput,
  CreateSocialInput,
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

  @Auth()
  @Mutation(() => Boolean)
  async createSocial(
    @Authorized('id') id: string,
    @Args('createSocialInput') socialData: CreateSocialInput,
  ): Promise<boolean> {
    return await this.profilesService.createSocial(id, socialData);
  }

  @Auth()
  @Mutation(() => Boolean)
  async reorderSocial(
    @Args('socialList') socialList: ChangeReorderSocialInput[],
  ): Promise<boolean> {
    return await this.profilesService.reorderSocial(socialList);
  }

  @Auth()
  @Mutation(() => Boolean)
  async deleteSocial(@Args('socialId') socialId: string): Promise<boolean> {
    return await this.profilesService.deleteSocial(socialId);
  }
}
