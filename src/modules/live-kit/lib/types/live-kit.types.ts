import { DynamicModule, FactoryProvider, ModuleMetadata } from '@nestjs/common';

export const liveKitConfigSymbol = Symbol('LiveKitConfig');

export interface ILiveKitForRootOption extends Pick<DynamicModule, 'global'> {
  apiKey: string;
  apiSecret: string;
  serverUrl: string;
}

export type TLiveKitForRootAsyncOption = Pick<ModuleMetadata, 'imports'> &
  Pick<FactoryProvider, 'useFactory' | 'inject'> &
  Pick<DynamicModule, 'global'>;
