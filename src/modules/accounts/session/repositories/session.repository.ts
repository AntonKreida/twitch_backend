import { Injectable } from '@nestjs/common';
import { RedisService } from '/src/core';
import { SessionModel } from '../models/session.model';

@Injectable()
export class SessionRepository {
  constructor(private readonly redisService: RedisService) {}

  async findSessions(userId: string): Promise<SessionModel[]> {
    const keys = await this.redisService.keys('*');

    const sessionUser: SessionModel[] = [];

    for (const key of keys) {
      const sessionJSON = await this.redisService.get(key);
      const session = sessionJSON ? JSON.parse(sessionJSON) : null;

      if (session?.userId === userId) {
        sessionUser.push({
          ...session,
          id: key?.split(':')[1],
        });
      }
    }

    return sessionUser;
  }
}
