import { Injectable } from '@nestjs/common';
import { User } from '/prisma/generated';

import { PrismaService } from '@core';
import { ArgsUsersDto } from '../dto';
import { UserEntity } from '../entityes';

@Injectable()
export class UserRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll(argsUsersDto?: ArgsUsersDto): Promise<User[]> {
    const { sort, pagination } = argsUsersDto;

    const paramsPagination = {
      take: pagination?.limit,
      skip: pagination?.page * pagination?.limit || 0,
    };

    return await this.prismaService.user.findMany({
      orderBy: {
        createAt: sort,
      },
      ...paramsPagination,
    });
  }

  async findById(id: string): Promise<User> {
    return await this.prismaService.user.findUnique({ where: { id } });
  }

  async createUser(user: UserEntity): Promise<User> {
    return await this.prismaService.user.create({ data: user });
  }
}
