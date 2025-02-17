import { Injectable } from '@nestjs/common';
import { Args, Context, Mutation } from '@nestjs/graphql';

import { VerificationService } from './verification.service';
import { IContext, ISessionMetadata, UserMetadata } from '@shared';
import { UserModel } from '../user';
import { VerifyInput } from './inputs';

@Injectable()
export class VerificationResolver {
  constructor(private readonly verificationService: VerificationService) {}

  @Mutation(() => UserModel, { name: 'verifyUser' })
  async verifyUser(
    @Context() { req }: IContext,
    @Args('inputVerify') { token }: VerifyInput,
    @UserMetadata() metadata: ISessionMetadata,
  ) {
    return await this.verificationService.verify(req, token, metadata);
  }
}
