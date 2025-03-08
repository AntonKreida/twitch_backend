import { Injectable } from '@nestjs/common';
import { Prisma, Social } from '/prisma/generated';
import { PrismaService } from '@core';

import { SocialEntity } from '../entities';

@Injectable()
export class SocialRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async createSocial(socialEntity: SocialEntity): Promise<Social> {
    return this.prismaService.social.create({
      data: {
        title: socialEntity.title,
        url: socialEntity.url,
        position: socialEntity.position,
        user: {
          connect: {
            id: socialEntity.userId,
          },
        },
      },
    });
  }

  async findAllSocials(args: Prisma.SocialFindManyArgs): Promise<Social[]> {
    return this.prismaService.social.findMany(args);
  }

  async findSocial(args: Prisma.SocialFindFirstArgs): Promise<Social | null> {
    return this.prismaService.social.findFirst(args);
  }

  async updateSocial(args: Prisma.SocialUpdateArgs): Promise<Social> {
    return this.prismaService.social.update(args);
  }

  async deleteSocial(socialId: string): Promise<Social> {
    return this.prismaService.social.delete({
      where: {
        id: socialId,
      },
    });
  }
}
