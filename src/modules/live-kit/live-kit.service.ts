import { Inject, Injectable } from '@nestjs/common';
import { RoomServiceClient } from 'livekit-server-sdk';
import { ILiveKitForRootOption, liveKitConfigSymbol } from './lib';
import { RoomModel } from './models';

@Injectable()
export class LiveKitService {
  private readonly roomServiceClient: RoomServiceClient;
  constructor(
    @Inject(liveKitConfigSymbol) private readonly config: ILiveKitForRootOption,
  ) {
    this.roomServiceClient = this.initRoomServiceClient();
  }

  async getListRoom(): Promise<RoomModel[]> {
    return this.roomServiceClient.listRooms();
  }

  private initRoomServiceClient(): RoomServiceClient {
    return new RoomServiceClient(
      this.config.serverUrl,
      this.config.apiKey,
      this.config.apiSecret,
    );
  }
}
