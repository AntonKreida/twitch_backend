import { Query, Resolver } from '@nestjs/graphql';
import { LiveKitService } from './live-kit.service';

@Resolver('LiveKit')
export class LiveKitResolver {
  constructor(private readonly liveKitService: LiveKitService) {}

  @Query(() => String, { name: 'key' })
  async getKey(): Promise<string> {
    return this.liveKitService.getKey();
  }
}
