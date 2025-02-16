import { Module } from '@nestjs/common';

import { VerificationModule } from '@/modules/accounts/verification';
import { SessionModule } from '@/modules/accounts/session';

import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';

@Module({
  imports: [VerificationModule, SessionModule],
  providers: [AuthService, AuthResolver],
})
export class AuthModule {}
