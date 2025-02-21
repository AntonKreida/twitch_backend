import { Module } from '@nestjs/common';
import { VerificationModule } from '@/modules/accounts/verification';
import { TfaService } from './tfa.service';
import { TfaResolver } from './tfa.resolver';

@Module({
  imports: [VerificationModule],
  providers: [TfaResolver, TfaService],
})
export class TfaModule {}
