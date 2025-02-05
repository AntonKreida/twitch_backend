import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { UserModel } from '../user';
import { ArgsUserDto, InputUserSignUpDto } from './dto';
import { SortOrPaginationArgsType } from '@shared';

@Resolver('Auth')
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => UserModel, { name: 'signUp' })
  async signUp(
    @Args('inputUserSignUp') inputUser: InputUserSignUpDto,
  ): Promise<UserModel> {
    return this.authService.registerUser(inputUser);
  }

  @Query(() => [UserModel], { name: 'users' })
  async findAll(
    @Args() sortOrPaginationType: SortOrPaginationArgsType,
  ): Promise<UserModel[]> {
    return await this.authService.findUsers(sortOrPaginationType);
  }

  @Query(() => UserModel, { name: 'user', nullable: true })
  async findById(@Args() args: ArgsUserDto): Promise<UserModel | null> {
    return await this.authService.findUser(args);
  }
}
