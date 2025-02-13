import { Injectable } from '@nestjs/common';
import { PrismaService } from '@core';
import { EntityToken } from '../entities';
import { Token, User } from '/prisma/generated';

@Injectable()
export class TokenRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async createTokenUserById(
    userId: string,
    token: EntityToken,
  ): Promise<Token & { user: User }> {
    return await this.prismaService.token.create({
      data: {
        expiresIn: token.expiresIn,
        token: token.token,
        type: token.type,
        user: {
          connect: {
            id: userId,
          },
        },
      },
      include: {
        user: true,
      },
    });
  }
}
