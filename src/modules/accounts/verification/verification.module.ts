import { Module } from '@nestjs/common';
import { VerificationService } from './verification.service';
import { TokenRepository } from './repositories';

@Module({
  providers: [TokenRepository, VerificationService],
  exports: [VerificationService],
})
export class VerificationModule {}
