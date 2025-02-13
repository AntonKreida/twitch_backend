import { Module } from '@nestjs/common';
import { SessionService } from './session.service';
import { SessionResolver } from './session.resolver';
import { SessionRepository } from './repositories';

@Module({
  providers: [SessionResolver, SessionRepository, SessionService],
  exports: [SessionService],
})
export class SessionModule {}
