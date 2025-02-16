import { Module } from '@nestjs/common';

import { EmailModule } from '@/modules/notification';
import { VerificationModule } from '../verification';
import { SessionModule } from '../session';

import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';

@Module({
  imports: [VerificationModule, SessionModule, EmailModule],
  providers: [AuthService, AuthResolver],
})
export class AuthModule {}
