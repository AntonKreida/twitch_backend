import { Inject, Injectable } from '@nestjs/common';
import { ILiveKitForRootOption, liveKitConfigSymbol } from './lib';

@Injectable()
export class LiveKitService {
  constructor(
    @Inject(liveKitConfigSymbol) private readonly config: ILiveKitForRootOption,
  ) {}

  async getKey(): Promise<string> {
    console.log(await this.config.apiKey);
    return await this.config.apiKey;
  }
}
