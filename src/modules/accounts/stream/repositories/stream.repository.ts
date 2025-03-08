import { Injectable } from '@nestjs/common';

import { PrismaService } from '@core';
import { StreamModel } from '../models';
import { SearchStreamInput } from '../inputs';
import { Prisma } from '/prisma/generated';

@Injectable()
export class StreamRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findMany(searchStream: SearchStreamInput): Promise<StreamModel[]> {
    const {
      search,
      pagination: { page, limit },
    } = searchStream;

    const whereStreams = search ? this.searchStream(search) : undefined;

    const paramsPagination = {
      take: limit ?? 10,
      skip: Math.max((page - 1) * limit, 0) ?? 0,
    };

    const streams = await this.prismaService.stream.findMany({
      skip: paramsPagination.skip,
      take: paramsPagination.take,
      where: {
        ...whereStreams,
      },
      include: {
        user: {
          include: {
            avatar: {
              include: {
                image: true,
              },
            },
          },
        },
      },
      orderBy: {
        createAt: 'desc',
      },
    });

    return streams.map((stream) => ({
      ...stream,
      user: {
        ...stream.user,
        avatar: stream.user.avatar?.image?.src || null,
      },
    }));
  }

  private searchStream(search: string): Prisma.StreamWhereInput {
    return {
      OR: [
        {
          title: {
            contains: search,
            mode: 'insensitive',
          },
        },
        {
          user: {
            username: {
              contains: search,
              mode: 'insensitive',
            },
          },
        },
      ],
    };
  }
}
