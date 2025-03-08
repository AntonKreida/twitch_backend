import { Injectable } from '@nestjs/common';
import { UserAvatar } from '/prisma/generated';
import { PrismaService } from '@core';

@Injectable()
export class AvatarRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async createAvatar(userId: string, avatar: string): Promise<UserAvatar> {
    return await this.prismaService.userAvatar.create({
      data: {
        user: {
          connect: {
            id: userId,
          },
        },
        image: {
          create: {
            src: avatar,
          },
        },
      },
      include: {
        image: true,
      },
    });
  }

  async deleteAvatar(userId?: string, id?: string): Promise<UserAvatar> {
    return await this.prismaService.userAvatar.delete({
      where: {
        userId,
        id,
      },
      include: {
        image: true,
      },
    });
  }
}
