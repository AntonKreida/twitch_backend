import { Module } from '@nestjs/common';

import { VerificationModule } from '../verification';
import { SessionModule } from '../session';

import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';

@Module({
  imports: [VerificationModule, SessionModule],
  providers: [AuthService, AuthResolver],
})
export class AuthModule {}
