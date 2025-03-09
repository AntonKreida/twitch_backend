import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { ProfilesService } from './profiles.service';
import { SocialModel, UserModel } from '@/modules/accounts/user';
import { Auth, Authorized } from '@shared';
import {
  ChangeAvatarUserInput,
  ChangeEmailUserInput,
  ChangeProfileInfoInput,
  ChangeReorderSocialInput,
  CreateSocialInput,
  ChangeUpdateSocialInput,
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
  @Mutation(() => Boolean, { name: 'removeUserAvatar' })
  async removeUserAvatar(@Authorized('id') id: string): Promise<boolean> {
    return await this.profilesService.removeUserAvatar(id);
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
    @Args('list', { type: () => [ChangeReorderSocialInput] })
    list: ChangeReorderSocialInput[],
  ): Promise<boolean> {
    return await this.profilesService.reorderSocial(list);
  }

  @Auth()
  @Mutation(() => Boolean)
  async deleteSocial(@Args('socialId') socialId: string): Promise<boolean> {
    return await this.profilesService.deleteSocial(socialId);
  }

  @Auth()
  @Mutation(() => Boolean)
  async updateSocial(
    @Args('updateSocial') updateSocial: ChangeUpdateSocialInput,
  ): Promise<boolean> {
    return await this.profilesService.updateSocial(updateSocial);
  }

  @Auth()
  @Mutation(() => [SocialModel])
  async findSocials(@Authorized('id') id: string): Promise<SocialModel[]> {
    return await this.profilesService.findSocials(id);
  }
}
