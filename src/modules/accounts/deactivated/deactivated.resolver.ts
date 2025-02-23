import { Args, Resolver } from '@nestjs/graphql';
import { Mutation } from '@nestjs/graphql';
import { DeactivatedService } from './deactivated.service';
import { Auth, Authorized, ISessionMetadata, UserMetadata } from '@shared';

@Resolver()
export class DeactivatedResolver {
  constructor(private readonly deactivatedService: DeactivatedService) {}

  @Auth()
  @Mutation(() => Boolean)
  async sendDeactivatedAccount(
    @Authorized('id') id: string,
    @UserMetadata() metadata: ISessionMetadata,
    @Args('email') email: string,
  ): Promise<boolean> {
    return await this.deactivatedService.sendDeactivatedAccountEmail(
      id,
      metadata,
      email,
    );
  }
}
