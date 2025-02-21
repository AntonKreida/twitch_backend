import { Module } from '@nestjs/common';
import { TfaService } from './tfa.service';
import { TfaResolver } from './tfa.resolver';

@Module({
  providers: [TfaResolver, TfaService],
})
export class TfaModule {}
