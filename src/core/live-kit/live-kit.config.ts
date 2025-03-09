import { ConfigService } from '@nestjs/config';
import { ILiveKitForRootOption } from '/src/modules/live-kit/lib';

export const liveKitConfig = (
  configService: ConfigService,
): ILiveKitForRootOption => ({
  apiKey: configService.getOrThrow<string>('API_URL'),
  apiSecret: 'asd',
  serverUrl: 'asd',
});
