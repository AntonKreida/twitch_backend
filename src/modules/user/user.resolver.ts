import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { UserRepository } from './repositories';
import { UserModel } from './models';
import { ArgsUsersDto, InputUserDto } from './dto';

@Resolver(() => UserModel)
export class UserResolver {
  constructor(private readonly userRepository: UserRepository) {}

  @Query(() => [UserModel], { name: 'users' })
  async findAll(@Args() argsUsers: ArgsUsersDto): Promise<UserModel[]> {
    return await this.userRepository.findAll(argsUsers);
  }

  @Query(() => UserModel, { name: 'user' })
  async findById(@Args('id') id: string): Promise<UserModel> {
    return await this.userRepository.findById(id);
  }

  @Mutation(() => UserModel, { name: 'createUser' })
  async createUser(@Args('user') user: InputUserDto): Promise<UserModel> {
    return await this.userRepository.createUser(user);
  }
}
