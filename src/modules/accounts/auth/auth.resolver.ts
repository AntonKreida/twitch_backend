import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';

import { AuthService } from './auth.service';
import { UserModel } from '../user';
import { UserArgsDto, UserInputSignInDto, UserInputSignUpDto } from './dto';
import {
  SortOrPaginationArgsType,
  IContext,
  Authorized,
  Auth,
  UserMetadata,
  ISessionMetadata,
} from '@shared';

@Resolver('Auth')
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Auth()
  @Query(() => [UserModel], { name: 'users' })
  async findAll(
    @Args() sortOrPaginationType: SortOrPaginationArgsType,
  ): Promise<UserModel[]> {
    return await this.authService.findUsers(sortOrPaginationType);
  }

  @Auth()
  @Query(() => UserModel, { name: 'user', nullable: true })
  async find(@Args() args: UserArgsDto): Promise<UserModel | null> {
    return await this.authService.findUser(args);
  }

  @Mutation(() => UserModel, { name: 'signUp' })
  async signUp(
    @Args('inputUserSignUp') inputUser: UserInputSignUpDto,
  ): Promise<UserModel> {
    return this.authService.signUp(inputUser);
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

  @Auth()
  @Query(() => UserModel, { name: 'me' })
  async me(@Authorized('id') id: string): Promise<UserModel> {
    return this.authService.findUser({ id: id });
  }
}
