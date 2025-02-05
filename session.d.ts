declare module 'express-session' {
  interface SessionData {
    userId?: string;
    createAt?: Date | string;
  }
}
