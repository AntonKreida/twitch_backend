import { Module } from '@nestjs/common';
import { VerificationService } from './verification.service';
import { TokenRepository } from './repositories';

import { UserModule } from '../user';
import { SessionModule } from '../session';

@Module({
  imports: [UserModule, SessionModule],
  providers: [TokenRepository, VerificationService],
  exports: [VerificationService],
})
export class VerificationModule {}
