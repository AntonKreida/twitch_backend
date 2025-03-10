import { DynamicModule, Module } from '@nestjs/common';
import {
  ILiveKitForRootOption,
  liveKitConfigSymbol,
  TLiveKitForRootAsyncOption,
} from './lib';
import { LiveKitService } from './live-kit.service';
import { LiveKitResolver } from './live-kit.resolver';

@Module({})
export class LiveKitModule {
  static forRoot(options: ILiveKitForRootOption): DynamicModule {
    return {
      module: LiveKitModule,
      providers: [
        {
          provide: liveKitConfigSymbol,
          useValue: options,
        },
        LiveKitService,
      ],
      exports: [LiveKitService],
      global: options.global,
    };
  }

  static forRootAsync(options: TLiveKitForRootAsyncOption): DynamicModule {
    return {
      module: LiveKitModule,
      imports: options.imports,
      providers: [
        {
          provide: liveKitConfigSymbol,
          inject: options.inject,
          useFactory: options.useFactory,
        },
        LiveKitService,
        LiveKitResolver,
      ],
      global: options.global,
      exports: [LiveKitService],
    };
  }
}
