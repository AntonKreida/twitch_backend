import { Injectable } from '@nestjs/common';
import { StreamRepository } from './repositories';
import { StreamModel } from './models';
import { SearchStreamInput } from './inputs';

@Injectable()
export class StreamService {
  constructor(private readonly streamRepository: StreamRepository) {}

  async findMany(searchStream: SearchStreamInput): Promise<StreamModel[]> {
    return await this.streamRepository.findMany(searchStream);
  }
}
