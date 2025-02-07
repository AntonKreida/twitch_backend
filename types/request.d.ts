import 'express';
import { User } from '../prisma/generated';

declare module 'express' {
  interface Request {
    user?: User;
  }
}
