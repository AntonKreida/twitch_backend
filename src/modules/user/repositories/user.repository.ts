import { Injectable } from '@nestjs/common';
import { PrismaService } from '@core';
import { User } from '/prisma/generated';

@Injectable()
export class UserRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll(): Promise<User[]> {
    return await this.prismaService.user.findMany();
  }
}
