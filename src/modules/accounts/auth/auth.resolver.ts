import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';

import { AuthService } from './auth.service';
import { UserModel } from '../user';
import { UserSignInInput, UserSignUpInput } from './inputs';
import { IContext, UserMetadata, ISessionMetadata } from '@shared';

@Resolver('Auth')
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => Boolean, { name: 'signUp' })
  async signUp(
    @Args('inputUserSignUp') inputUser: UserSignUpInput,
  ): Promise<boolean> {
    return await this.authService.signUp(inputUser);
  }

  @Mutation(() => UserModel, { name: 'signIn' })
  async signIn(
    @Args('inputUserSignIn') inputUser: UserSignInInput,
    @Context() { req }: IContext,
    @UserMetadata() metadata: ISessionMetadata,
  ): Promise<UserModel> {
    const { username, password } = inputUser;

    return await this.authService.signIn(req, username, password, metadata);
  }

  @Mutation(() => String, { name: 'signOut' })
  async signOut(@Context() { req, res }: IContext): Promise<boolean> {
    return await this.authService.signOut(req, res);
  }
}
