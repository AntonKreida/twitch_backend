import 'express-session';
import { ISessionMetadata } from '@shared';

declare module 'express-session' {
  interface SessionData {
    userId?: string;
    createAt?: Date | string;
    metadata: ISessionMetadata;
  }
}
