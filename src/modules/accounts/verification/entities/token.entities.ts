import { Token, ENUM_TYPE_TOKEN } from '/prisma/generated';
import { v4 as uuid } from 'uuid';

type TEntityToken = Partial<Token>;

export class EntityToken implements TEntityToken {
  id?: string | null;
  expiresIn: Date;
  token: string;
  type: ENUM_TYPE_TOKEN;
  userId: string;

  constructor(token: TEntityToken) {
    this.id = token?.id;
    this.expiresIn = token?.expiresIn;
    this.token = token?.token;
    this.type = token?.type;
    this.userId = token?.userId;
  }

  sendToken({ isUUID }: { isUUID: boolean }) {
    const fiveHoursInMs = 18000000;

    this.expiresIn = new Date(new Date().getTime() + fiveHoursInMs);

    if (isUUID) {
      this.token = uuid();

      return this.token;
    }

    const tokenGenerated = Math.floor(
      Math.random() * (1000000 - 100000) + 100000,
    ).toString();

    this.token = tokenGenerated;
  }
}
