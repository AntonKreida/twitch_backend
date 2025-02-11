import { ConflictException, Injectable } from '@nestjs/common';
import { SessionRepository } from './repositories';
import { type Response, type Request } from 'express';
import { SessionModel } from './models';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SessionService {
  constructor(
    private readonly sessionRepository: SessionRepository,
    private readonly configService: ConfigService,
  ) {}

  async findSessionByUser(req: Request): Promise<SessionModel[]> {
    const sessions = await this.sessionRepository.findSessionsByUser(
      req.session.userId,
    );

    return sessions.filter((session) => req.session.id !== session.id);
  }

  async findCurrentSession(req: Request): Promise<SessionModel | null> {
    return await this.sessionRepository.findCurrentSession(req.session.id);
  }

  async clearCookie(res: Response): Promise<boolean> {
    res.clearCookie(`${this.configService.getOrThrow('SESSION_NAME')}`);

    return true;
  }

  async removeSessionById(req: Request, id: string): Promise<boolean> {
    if (req.session.id === id) {
      throw new ConflictException('Нельзя удалить текущую сессию!');
    }

    await this.sessionRepository.removeSession(id);

    return true;
  }
}
