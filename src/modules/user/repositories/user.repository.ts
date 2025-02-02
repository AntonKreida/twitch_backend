import { Injectable } from '@nestjs/common';
import { User } from '/prisma/generated';

import { PrismaService } from '@core';
import { ArgsUsersDto } from '../dto';

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
}
