import { Module } from '@nestjs/common';
import { PasswordService } from './password.service';
import { PasswordResolver } from './password.resolver';
import { VerificationModule } from '../verification';

@Module({
  imports: [VerificationModule],
  providers: [PasswordResolver, PasswordService],
})
export class PasswordModule {}
