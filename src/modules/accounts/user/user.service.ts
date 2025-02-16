import { Injectable } from '@nestjs/common';
import { UserModel } from './models';
import { UserRepository } from './repositories';
import { SortOrPaginationArgsType } from '@shared';
import { IArgsFindUser } from './lib';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async findUsers({
    sort,
    pagination,
  }: SortOrPaginationArgsType): Promise<UserModel[]> {
    return await this.userRepository.findAll({
      sort,
      pagination,
    });
  }

  async findUser(args: Partial<IArgsFindUser>): Promise<UserModel | null> {
    return await this.userRepository.findUser(args);
  }
}
