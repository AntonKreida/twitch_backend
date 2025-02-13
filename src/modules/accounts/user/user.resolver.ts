import { Args, Resolver, Query } from '@nestjs/graphql';
import { UserModel } from './models';
import { UserService } from './user.service';
import { UserArgsDto } from './dto';
import { SortOrPaginationArgsType, Auth, Authorized } from '@shared';

@Resolver('User')
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Auth()
  @Query(() => UserModel, { name: 'user', nullable: true })
  async find(@Args() args: UserArgsDto): Promise<UserModel | null> {
    return await this.userService.findUser(args);
  }

  @Auth()
  @Query(() => [UserModel], { name: 'users' })
  async findAll(
    @Args() sortOrPaginationType: SortOrPaginationArgsType,
  ): Promise<UserModel[]> {
    return await this.userService.findUsers(sortOrPaginationType);
  }

  @Auth()
  @Query(() => UserModel, { name: 'me' })
  async me(@Authorized('id') id: string): Promise<UserModel> {
    return this.userService.findUser({ id: id });
  }
}
