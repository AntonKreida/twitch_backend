import { Query, Resolver } from '@nestjs/graphql';
import { LiveKitService } from './live-kit.service';
import { RoomModel } from './models';

@Resolver('LiveKit')
export class LiveKitResolver {
  constructor(private readonly liveKitService: LiveKitService) {}

  @Query(() => [RoomModel], { name: 'listRoom' })
  async getListRoom(): Promise<RoomModel[]> {
    return await this.liveKitService.getListRoom();
  }
}
