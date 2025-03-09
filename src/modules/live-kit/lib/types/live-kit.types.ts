import { FactoryProvider, ModuleMetadata } from '@nestjs/common';

export const liveKitConfigSymbol = Symbol('LiveKitConfig');

export interface ILiveKitForRootOption {
  apiKey: string;
  apiSecret: string;
  serverUrl: string;
}

export type TLiveKitForRootAsyncOption = Pick<ModuleMetadata, 'imports'> &
  Pick<FactoryProvider, 'useFactory' | 'inject'>;
