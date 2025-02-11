import { Injectable } from '@nestjs/common';
import { RedisService } from '@core';
import { SessionModel } from '../models';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SessionRepository {
  constructor(
    private readonly redisService: RedisService,
    private readonly configService: ConfigService,
  ) {}

  async findSessionsByUser(userId: string): Promise<SessionModel[]> {
    const keys = await this.redisService.keys('*');

    const sessionUser = await keys.reduce<Promise<SessionModel[]>>(
      async (accP: Promise<SessionModel[]>, key) => {
        const sessionJSON = (await this.redisService.get(key)) as string | null;
        const session: SessionModel | null = sessionJSON
          ? JSON.parse(sessionJSON)
          : null;

        const awAcc = await accP;

        if (session?.userId === userId) {
          awAcc.push({
            ...session,
            id: key?.split(':')[1],
          });
        }

        return awAcc;
      },
      Promise.resolve([]),
    );

    sessionUser.sort(
      (prev, next) =>
        new Date(prev.createAt).getTime() - new Date(next.createAt).getTime(),
    );

    return sessionUser;
  }

  async findCurrentSession(sessionId: string): Promise<SessionModel | null> {
    const currentSessionJSON = await this.redisService.get(
      this.configService.getOrThrow<string>('SESSION_PREFIX') + sessionId,
    );

    const currentSession = currentSessionJSON
      ? JSON.parse(currentSessionJSON)
      : null;

    return {
      ...currentSession,
      id: sessionId,
    };
  }

  async removeSession(sessionId: string): Promise<void> {
    await this.redisService.del(
      this.configService.getOrThrow<string>('SESSION_PREFIX') + sessionId,
    );
  }
}
