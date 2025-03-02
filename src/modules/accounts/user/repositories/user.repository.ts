import { Injectable } from '@nestjs/common';
import { Prisma, User } from '/prisma/generated';

import { UserEntity } from '../entities';
import { IArgsFindUser } from '../lib/interfaces';

import { PrismaService } from '@core';
import { SORT_ENUM, SortOrPaginationArgsType } from '@shared';
import { UserModel } from '../models';
import { GetBatchResult } from '@prisma/client/runtime/library';

export type TFindAll = SortOrPaginationArgsType &
  Partial<Omit<UserModel, 'avatar'>>;

@Injectable()
export class UserRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll({
    sort = SORT_ENUM.ASC,
    pagination,
    ...userData
  }: TFindAll): Promise<UserModel[]> {
    const paramsPagination = {
      take: pagination?.limit,
      skip: pagination?.page * pagination?.limit || 0,
    };

    const users = await this.prismaService.user.findMany({
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
      include: {
        avatar: {
          include: {
            image: true,
          },
        },
      },
    });

    return users.map((user) => ({
      ...user,
      avatar: user?.avatar?.image?.src ?? null,
    }));
  }

  async findUser({
    id,
    email,
    username,
  }: Partial<IArgsFindUser>): Promise<UserModel> | null {
    const user = await await this.prismaService.user.findFirst({
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
      include: {
        avatar: {
          include: {
            image: true,
          },
        },
      },
    });

    return {
      ...user,
      avatar: user?.avatar?.image?.src ?? null,
    };
  }

  async createUser(user: UserEntity): Promise<User> {
    let dataUserCreate;

    if (user.avatar) {
      dataUserCreate = {
        ...user,
        avatar: {
          create: {
            image: {
              create: {
                src: user.avatar,
              },
            },
          },
        },
      };
    } else {
      dataUserCreate = {
        ...user,
      };
    }

    return await this.prismaService.user.create({
      data: dataUserCreate,
    });
  }

  async updateUser(userData: Partial<User>): Promise<UserModel> {
    const user = await this.prismaService.user.update({
      where: {
        id: userData.id,
      },
      data: {
        ...userData,
      },
      include: {
        avatar: {
          include: {
            image: true,
          },
        },
      },
    });

    return {
      ...user,
      avatar: user?.avatar?.image?.src ?? null,
    };
  }

  async deletedUsers(args: Prisma.UserWhereInput): Promise<GetBatchResult> {
    return await this.prismaService.user.deleteMany({
      where: {
        ...args,
      },
    });
  }
}
