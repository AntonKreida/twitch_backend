import { Module } from '@nestjs/common';
import { VerificationService } from './verification.service';
import { VerificationResolver } from './verification.resolver';
import { TokenRepository } from './repositories';

import { UserModule } from '../user';
import { SessionModule } from '../session';

@Module({
  imports: [UserModule, SessionModule],
  providers: [TokenRepository, VerificationService, VerificationResolver],
  exports: [VerificationService],
})
export class VerificationModule {}
