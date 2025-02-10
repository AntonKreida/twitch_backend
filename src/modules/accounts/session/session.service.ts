import { Injectable } from '@nestjs/common';
import { SessionRepository } from './repositories';
import { type Request } from 'express';
import { SessionModel } from './models';

@Injectable()
export class SessionService {
  constructor(private readonly sessionRepository: SessionRepository) {}

  async findSessionByUser(req: Request): Promise<SessionModel[]> {
    const { session } = req;
    return await this.sessionRepository.findSessions(session.userId);
  }
}
