import { ConfigService } from '@nestjs/config';
import { ILiveKitForRootOption } from '/src/modules/live-kit/lib';

export const liveKitConfig = (
  configService: ConfigService,
): ILiveKitForRootOption => ({
  apiKey: configService.getOrThrow<string>('LIVEKIT_API_KEY'),
  apiSecret: configService.getOrThrow<string>('LIVEKIT_API_SECRET'),
  serverUrl: configService.getOrThrow<string>('LIVEKIT_URL'),
});
