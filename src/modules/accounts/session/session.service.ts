import { Injectable } from '@nestjs/common';
import { SessionRepository } from './repositories';
import { type Request } from 'express';
import { SessionModel } from './models';

@Injectable()
export class SessionService {
  constructor(private readonly sessionRepository: SessionRepository) {}

  async findSessionByUser(req: Request): Promise<SessionModel[]> {
    const sessions = await this.sessionRepository.findSessionsByUser(
      req.session.userId,
    );

    return sessions.filter((session) => req.session.id !== session.id);
  }

  async findCurrentSession(req: Request): Promise<SessionModel | null> {
    return await this.sessionRepository.findCurrentSession(req.session.id);
  }
}
