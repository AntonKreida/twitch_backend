import { Resolver, Query } from '@nestjs/graphql';
import { UserRepository } from './repositories';
import { UserModel } from './models';

@Resolver(() => UserModel)
export class UserResolver {
  constructor(private readonly userRepository: UserRepository) {}

  @Query(() => [UserModel], { name: 'findAllUsers' })
  async findAll(): Promise<UserModel[]> {
    return await this.userRepository.findAll();
  }
}
