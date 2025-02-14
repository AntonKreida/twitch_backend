import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { SessionRepository } from './repositories';
import { type Response, type Request } from 'express';
import { SessionModel } from './models';
import { ConfigService } from '@nestjs/config';
import { ISessionMetadata } from '/src/shared';
import { UserModel } from '../user';

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

  async saveSession(
    req: Request,
    user: UserModel,
    metadata: ISessionMetadata,
  ): Promise<UserModel> {
    return new Promise((resolve, reject) => {
      req.session.userId = user.id;
      req.session.createAt = new Date();
      req.session.metadata = metadata;

      req.session.save((error) => {
        if (error) {
          reject(
            new InternalServerErrorException(
              'При сохранении сессии произошла ошибка!',
            ),
          );
        }

        resolve(user);
      });
    });
  }

  async destroySession(req: Request, res: Response): Promise<boolean> {
    return new Promise((resolve, reject) => {
      req.session.destroy((error) => {
        if (error) {
          reject(
            new InternalServerErrorException(
              'При удалении сессии произошла ошибка!',
            ),
          );
        }

        res.clearCookie(`${this.configService.getOrThrow('SESSION_NAME')}`);

        resolve(true);
      });
    });
  }
}
