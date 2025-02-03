import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { UserModel } from '../user';
import { ArgsUserDto, InputUserRegisterDto } from './dto';
import { SortOrPaginationArgsType } from '@shared';

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
    @Args() { id, username, email }: ArgsUserDto,
  ): Promise<UserModel> {
    return await this.authService.findUser({
      id,
      username,
      email,
    });
  }
}
