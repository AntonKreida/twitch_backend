import { Injectable } from '@nestjs/common';
import { PrismaService } from '@core';
import { EntityToken } from '../entities';
import { ENUM_TYPE_TOKEN, Token, User } from '/prisma/generated';

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

  async findTokenById(tokenId: string): Promise<Token | null> {
    return await this.prismaService.token.findUnique({
      where: {
        id: tokenId,
      },
    });
  }

  async deleteTokenById(tokenId: string): Promise<boolean> {
    await this.prismaService.token.delete({
      where: {
        id: tokenId,
      },
    });

    return true;
  }

  async findTokenByUserIdAndType(
    userId: string,
    type: ENUM_TYPE_TOKEN,
  ): Promise<Token | null> {
    return await this.prismaService.token.findFirst({
      where: {
        type: type,
        user: {
          id: userId,
        },
      },
    });
  }
}
