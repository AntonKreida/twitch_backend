import { Injectable } from '@nestjs/common';
import { StreamRepository } from './repositories';
import { StreamModel } from './models';
import { SearchStreamInput } from './inputs';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class StreamService {
  constructor(
    private readonly streamRepository: StreamRepository,
    private readonly configService: ConfigService,
  ) {}

  async findMany(searchStream: SearchStreamInput): Promise<StreamModel[]> {
    return await this.streamRepository.findMany(searchStream);
  }

  async findRandomStream(): Promise<StreamModel[]> {
    const countStream = this.configService.getOrThrow<number>(
      'COUNT_RANDOM_STREAM',
    );

    return await this.streamRepository.findRandomStream(countStream);
  }
}
