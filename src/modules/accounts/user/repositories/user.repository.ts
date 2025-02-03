import { Injectable } from '@nestjs/common';
import { User } from '/prisma/generated';

import { UserEntity } from '../entities';
import { IArgsFindUser } from '../lib/interfaces';

import { PrismaService } from '@core';
import { SortOrPaginationArgsType } from '@shared';

@Injectable()
export class UserRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll({
    sort,
    pagination,
  }: SortOrPaginationArgsType): Promise<User[]> {
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

  async findUser({
    id,
    email,
    username,
  }: Partial<IArgsFindUser>): Promise<User> {
    return await this.prismaService.user.findUnique({
      where: { id, email, username },
    });
  }

  async createUser(user: UserEntity): Promise<User> {
    return await this.prismaService.user.create({ data: user });
  }
}
