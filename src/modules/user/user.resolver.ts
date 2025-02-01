import { Resolver, Query, Args } from '@nestjs/graphql';
import { UserRepository } from './repositories';
import { UserModel } from './models';
import { ArgsUsersDto } from './dto';

@Resolver(() => UserModel)
export class UserResolver {
  constructor(private readonly userRepository: UserRepository) {}

  @Query(() => [UserModel], { name: 'findAllUsers' })
  async findAll(@Args() _argsUsers: ArgsUsersDto): Promise<UserModel[]> {
    return await this.userRepository.findAll();
  }
}
