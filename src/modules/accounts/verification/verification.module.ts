import { Module } from '@nestjs/common';
import { VerificationService } from './verification.service';
import { VerificationResolver } from './verification.resolver';
import { TokenRepository } from './repositories';

import { UserModule } from '@/modules/accounts/user';
import { SessionModule } from '@/modules/accounts/session';
import { EmailModule } from '@/modules/notification';

@Module({
  imports: [UserModule, SessionModule, EmailModule],
  providers: [TokenRepository, VerificationService, VerificationResolver],
  exports: [VerificationService],
})
export class VerificationModule {}
