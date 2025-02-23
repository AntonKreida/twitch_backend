import { Injectable } from '@nestjs/common';
import { Prisma, User } from '/prisma/generated';

import { UserEntity } from '../entities';
import { IArgsFindUser } from '../lib/interfaces';

import { PrismaService } from '@core';
import { SORT_ENUM, SortOrPaginationArgsType } from '@shared';
import { UserModel } from '../models';
import { GetBatchResult } from '@prisma/client/runtime/library';

export type TFindAll = SortOrPaginationArgsType & Partial<UserModel>;

@Injectable()
export class UserRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll({
    sort = SORT_ENUM.ASC,
    pagination,
    ...userData
  }: TFindAll): Promise<User[]> {
    const paramsPagination = {
      take: pagination?.limit,
      skip: pagination?.page * pagination?.limit || 0,
    };

    return await this.prismaService.user.findMany({
      orderBy: {
        createAt: sort,
      },
      ...paramsPagination,
      where: {
        ...userData,
        deactivatedAt: {
          lte: userData.deactivatedAt,
        },
      },
    });
  }

  async findUser({
    id,
    email,
    username,
  }: Partial<IArgsFindUser>): Promise<User | null> {
    return await this.prismaService.user.findFirst({
      where: {
        OR: [
          {
            id: {
              equals: id,
            },
            email: {
              equals: email,
            },
            username: {
              equals: username,
            },
          },
        ],
      },
    });
  }

  async createUser(user: UserEntity): Promise<User> {
    return await this.prismaService.user.create({ data: user });
  }

  async updateUser(userData: Partial<User>): Promise<User> {
    return await this.prismaService.user.update({
      where: {
        id: userData.id,
      },
      data: {
        ...userData,
      },
    });
  }

  async deletedUsers(args: Prisma.UserWhereInput): Promise<GetBatchResult> {
    return await this.prismaService.user.deleteMany({
      where: {
        ...args,
      },
    });
  }
}
