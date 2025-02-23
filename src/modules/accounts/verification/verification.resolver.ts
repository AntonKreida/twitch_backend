import { Injectable } from '@nestjs/common';
import { Args, Mutation } from '@nestjs/graphql';

import { VerificationService } from './verification.service';
import { VerifyInput, VerifyPasswordRecoveryInput } from './inputs';

@Injectable()
export class VerificationResolver {
  constructor(private readonly verificationService: VerificationService) {}

  @Mutation(() => Boolean, { name: 'verifyUser' })
  async verifyUser(@Args('inputVerify') { token }: VerifyInput) {
    return await this.verificationService.verify(token);
  }

  @Mutation(() => Boolean, { name: 'verifyPasswordRecovery' })
  async verifyPasswordRecovery(
    @Args('inputVerifyPasswordRecovery')
    { password, token }: VerifyPasswordRecoveryInput,
  ): Promise<boolean> {
    return await this.verificationService.verifyPasswordRecovery(
      token,
      password,
    );
  }
}
