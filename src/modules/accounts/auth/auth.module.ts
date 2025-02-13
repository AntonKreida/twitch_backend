import { Module } from '@nestjs/common';

import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { VerificationModule } from '../verification';

@Module({
  imports: [VerificationModule],
  providers: [AuthService, AuthResolver],
})
export class AuthModule {}
