import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { UserModel } from '../user';
import { InputUserRegisterDto } from './dto';
import { SortOrPaginationArgsType } from '/src/shared';

@Resolver('Auth')
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => UserModel, { name: 'registerUser' })
  async register(
    @Args('inputUserRegister') inputUser: InputUserRegisterDto,
  ): Promise<UserModel> {
    return this.authService.registerUser(inputUser);
  }

  @Query(() => [UserModel], { name: 'users' })
  async findAll(
    @Args() sortOrPaginationType: SortOrPaginationArgsType,
  ): Promise<UserModel[]> {
    return await this.authService.findUsers(sortOrPaginationType);
  }

  @Query(() => UserModel, { name: 'user' })
  async findById(
    @Args('id', { nullable: true }) id: string,
    @Args('username', { nullable: true }) username: string,
    @Args('email', { nullable: true }) email: string,
  ): Promise<UserModel> {
    return await this.authService.findUser({
      id,
      username,
      email,
    });
  }
}
