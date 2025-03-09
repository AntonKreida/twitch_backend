import { Injectable } from '@nestjs/common';
import { Prisma, StreamPreview } from '/prisma/generated';

import { PrismaService } from '@core';
import { StreamModel } from '../models';
import { ChangeInfoStreamInput, SearchStreamInput } from '../inputs';

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
        streamPreview: {
          include: {
            image: true,
          },
        },
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
      streamPreview: stream.streamPreview?.image?.src || null,
      user: {
        ...stream.user,
        avatar: stream.user.avatar?.image?.src || null,
      },
    }));
  }

  async findRandomStream(count: number): Promise<StreamModel[]> {
    const totalStreams = await this.prismaService.stream.count();

    const indexStreams = new Set();

    while (indexStreams.size < (count <= totalStreams ? count : totalStreams)) {
      indexStreams.add(Math.floor(Math.random() * totalStreams));
    }

    const streams = await this.prismaService.stream.findMany({
      skip: 0,
      take: totalStreams,
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
        streamPreview: {
          include: {
            image: true,
          },
        },
      },
      orderBy: {
        createAt: 'desc',
      },
    });

    return streams
      .filter((_, index) => indexStreams.has(index))
      .map((stream) => ({
        ...stream,
        streamPreview: stream.streamPreview?.image?.src || null,
        user: {
          ...stream.user,
          avatar: stream.user.avatar?.image?.src || null,
        },
      }));
  }

  async updateStream(
    userId: string,
    { title }: ChangeInfoStreamInput,
  ): Promise<StreamModel> {
    const stream = await this.prismaService.stream.update({
      where: {
        userId,
      },
      data: {
        title,
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
        streamPreview: {
          include: {
            image: true,
          },
        },
      },
    });

    return {
      ...stream,
      streamPreview: stream.streamPreview?.image?.src || null,
      user: {
        ...stream.user,
        avatar: stream.user.avatar?.image?.src || null,
      },
    };
  }

  async findStreamUserById(userId: string): Promise<StreamModel> {
    const stream = await this.prismaService.stream.findUnique({
      where: {
        userId,
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
        streamPreview: {
          include: {
            image: true,
          },
        },
      },
    });

    return {
      ...stream,
      streamPreview: stream.streamPreview?.image?.src || null,
      user: {
        ...stream.user,
        avatar: stream.user.avatar?.image?.src || null,
      },
    };
  }

  async changePreviewStream(
    streamId: string,
    preview: string,
  ): Promise<StreamPreview> {
    return await this.prismaService.streamPreview.upsert({
      where: {
        streamId,
      },
      create: {
        stream: {
          connect: {
            id: streamId,
          },
        },
        image: {
          create: {
            src: preview,
          },
        },
      },
      update: {
        image: {
          update: {
            src: preview,
          },
        },
      },
      include: {
        image: true,
      },
    });
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
