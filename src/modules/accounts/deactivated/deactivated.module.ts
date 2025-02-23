import { Module } from '@nestjs/common';

import { VerificationModule } from '@/modules/accounts/verification';

import { DeactivatedService } from './deactivated.service';
import { DeactivatedResolver } from './deactivated.resolver';

@Module({
  imports: [VerificationModule],
  providers: [DeactivatedResolver, DeactivatedService],
})
export class DeactivatedModule {}
