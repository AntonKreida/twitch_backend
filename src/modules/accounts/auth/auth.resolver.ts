import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';

import { AuthService } from './auth.service';
import { UserModel } from '../user';
import { UserInputSignInDto, UserInputSignUpDto } from './dto';
import { IContext, UserMetadata, ISessionMetadata } from '@shared';

@Resolver('Auth')
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => Boolean, { name: 'signUp' })
  async signUp(
    @Args('inputUserSignUp') inputUser: UserInputSignUpDto,
  ): Promise<boolean> {
    await this.authService.signUp(inputUser);

    return true;
  }

  @Mutation(() => UserModel, { name: 'signIn' })
  async signIn(
    @Args('inputUserSignIn') inputUser: UserInputSignInDto,
    @Context() { req }: IContext,
    @UserMetadata() metadata: ISessionMetadata,
  ): Promise<UserModel> {
    const { username, password } = inputUser;

    return await this.authService.signIn(req, username, password, metadata);
  }

  @Mutation(() => String, { name: 'signOut' })
  async signOut(@Context() { req, res }: IContext): Promise<string> {
    return await this.authService.signOut(req, res);
  }
}
