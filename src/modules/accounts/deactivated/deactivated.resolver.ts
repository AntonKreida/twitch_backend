import { Args, Context, Resolver } from '@nestjs/graphql';
import { Mutation } from '@nestjs/graphql';
import { DeactivatedService } from './deactivated.service';
import { SendDeactivatedEmailInput } from './inputs';

import {
  Auth,
  Authorized,
  IContext,
  ISessionMetadata,
  UserMetadata,
} from '@shared';
import { UserModel } from '../user';
import { DeactivatedInput } from './inputs/deactivated.input';

@Resolver()
export class DeactivatedResolver {
  constructor(private readonly deactivatedService: DeactivatedService) {}

  @Auth()
  @Mutation(() => Boolean)
  async sendDeactivatedAccount(
    @Authorized('id') id: string,
    @UserMetadata() metadata: ISessionMetadata,
    @Args('sendDeactivatedEmailInput') { email }: SendDeactivatedEmailInput,
  ): Promise<boolean> {
    return await this.deactivatedService.sendDeactivatedAccountEmail(
      id,
      metadata,
      email,
    );
  }

  @Auth()
  @Mutation(() => UserModel)
  async deactivated(
    @Context() { req, res }: IContext,
    @Authorized('id') id: string,
    @UserMetadata() metadata: ISessionMetadata,
    @Args('deactivatedInput') { password, token }: DeactivatedInput,
  ): Promise<UserModel> {
    return await this.deactivatedService.deactivated(
      token,
      req,
      res,
      id,
      password,
      metadata,
    );
  }
}
